import { randomUUIDv7 } from "bun";
import type { OutgoingMessage, SignupOutgoingMessage, ValidateOutgoingMessage } from "common/types";
import { Keypair, PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";
import nacl_util from "tweetnacl-util";

// Callback registry
const CALLBACKS: { [callbackId: string]: (data: SignupOutgoingMessage) => void } = {};
let validatorId: string | null = null;

// Sign a message with Solana keypair
function signMessage(message: string, keypair: Keypair): Promise<string> {
    const messageBytes = nacl_util.decodeUTF8(message);
    const signature = nacl.sign.detached(messageBytes, keypair.secretKey);
    return Promise.resolve(nacl_util.encodeBase64(signature));
}

// Main function
async function main() {
    console.log("Validator starting...");

    if (!process.env.PRIVATE_KEY) {
        console.error("PRIVATE_KEY environment variable is not set!");
        return;
    }

    // Parse private key safely
    const keypair = Keypair.fromSecretKey(
        Uint8Array.from(JSON.parse(process.env.PRIVATE_KEY))
    );

    const ws = new WebSocket("ws://localhost:8081");

    ws.onopen = () => {
        console.log("WebSocket connected to server!");
        registerValidator(ws, keypair);
    };

    ws.onmessage = async (event) => {
        try {
            const data: OutgoingMessage = JSON.parse(event.data);
            console.log("Received message from server:", data);

            if (data.type === "signup") {
                CALLBACKS[data.data.callbackId]?.(data.data);
                delete CALLBACKS[data.data.callbackId];
            } else if (data.type === "validate") {
                await validateHandler(ws, data.data, keypair);
            }
        } catch (err) {
            console.error("Failed to handle incoming message:", err);
        }
    };

    ws.onerror = (err) => {
        console.error("WebSocket error:", err);
    };

    ws.onclose = () => {
        console.warn("WebSocket connection closed. Reconnecting in 5s...");
        setTimeout(main, 5000);
    };

    // Heartbeat log
    setInterval(() => {
        console.log("Validator is running...");
    }, 10000);
}

// Register validator with the hub
async function registerValidator(ws: WebSocket, keypair: Keypair) {
    const callbackId = randomUUIDv7();

    CALLBACKS[callbackId] = (data: SignupOutgoingMessage) => {
        validatorId = data.validatorId;
        console.log("Validator registered with ID:", validatorId);
    };

    const signedMessage = await signMessage(
        `Signed message for ${callbackId}, ${keypair.publicKey.toBase58()}`,
        keypair
    );

    ws.send(JSON.stringify({
        type: "signup",
        data: {
            callbackId,
            ip: "127.0.0.1",
            publicKey: keypair.publicKey.toBase58(),
            signedMessage,
        },
    }));
}

// Validate a website
async function validateHandler(
    ws: WebSocket,
    { url, callbackId, websiteId }: ValidateOutgoingMessage,
    keypair: Keypair
) {
    console.log(`Validating ${url}...`);
    const startTime = Date.now();
    const signature = await signMessage(`Replying to ${callbackId}`, keypair);

    try {
        // Disable SSL verification for Bun (dev/test only)
        (process.env.NODE_TLS_REJECT_UNAUTHORIZED ??= "0");
        const response = await fetch(url);
        const endTime = Date.now();
        const latency = endTime - startTime;
        const status = response.status;

        console.log(`${url} - status: ${status} - latency: ${latency}ms`);

        ws.send(JSON.stringify({
            type: "validate",
            data: {
                callbackId,
                status: status === 200 ? "Good" : "Bad",
                latency,
                websiteId,
                validatorId,
                signedMessage: signature,
            },
        }));
    } catch (error) {
        console.warn(`${url} - validation failed:`, (error as Error).message);

        ws.send(JSON.stringify({
            type: "validate",
            data: {
                callbackId,
                status: "Bad",
                latency: 1000,
                websiteId,
                validatorId,
                signedMessage: signature,
            },
        }));
    }
}

// Start the validator
main();
