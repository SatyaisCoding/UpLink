import { randomUUIDv7, type ServerWebSocket } from "bun";
import type { IncomingMessage, SignupIncomingMessage } from "../../packages/common/index";
import { prismaClient } from "db/client";
import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";
import nacl_util from "tweetnacl-util";

const availableValidators: {
    validatorId: string;
    socket: ServerWebSocket<unknown>;
    publicKey: string;
}[] = [];

const CALLBACKS: { [callbackId: string]: { resolve: (data: IncomingMessage) => void, timeout: NodeJS.Timeout } } = {};
const COST_PER_VALIDATION = 100; // in lamports
const VALIDATION_TIMEOUT = 10000; // 10 seconds

// Bun WebSocket server
Bun.serve({
    port: 8081,
    fetch(req, server) {
        if (server.upgrade(req)) return;
        return new Response("Upgrade failed", { status: 500 });
    },
    websocket: {
        async message(ws: ServerWebSocket<unknown>, message: string) {
            try {
                const data: IncomingMessage = JSON.parse(message);

                if (data.type === "signup") {
                    const verified = await verifyMessage(
                        `Signed message for ${data.data.callbackId}, ${data.data.publicKey}`,
                        data.data.publicKey,
                        data.data.signedMessage
                    );

                    if (verified) await signupHandler(ws, data.data);
                    else console.warn("Signup signature verification failed for", data.data.publicKey);

                } else if (data.type === "validate") {
                    const cbObj = CALLBACKS[data.data.callbackId];
                    if (cbObj) {
                        clearTimeout(cbObj.timeout);
                        cbObj.resolve(data);
                        delete CALLBACKS[data.data.callbackId];
                    } else console.warn("No callback found for", data.data.callbackId);
                }
            } catch (err) {
                console.error("Error handling websocket message:", err);
            }
        },
        async close(ws: ServerWebSocket<unknown>) {
            const index = availableValidators.findIndex(v => v.socket === ws);
            if (index !== -1) availableValidators.splice(index, 1);
            console.log("Validator disconnected");
        },
    },
});

console.log("Hub server running on ws://localhost:8081");

// Handle validator signup
async function signupHandler(ws: ServerWebSocket<unknown>, { ip, publicKey, callbackId }: SignupIncomingMessage) {
    let validator = await prismaClient.validator.findFirst({ where: { publicKey } });
    if (!validator) {
        validator = await prismaClient.validator.create({
            data: { ip, publicKey, location: "unknown" },
        });
    }

    ws.send(JSON.stringify({
        type: "signup",
        data: { validatorId: validator.id, callbackId },
    }));

    availableValidators.push({ validatorId: validator.id, socket: ws, publicKey: validator.publicKey });
    console.log(`Validator ${validator.id} registered`);
}

// Verify signed messages
async function verifyMessage(message: string, publicKey: string, signature: string) {
    try {
        const messageBytes = nacl_util.decodeUTF8(message);
        const signatureBytes = nacl_util.decodeBase64(signature);
        const pubKeyBytes = new PublicKey(publicKey).toBytes();
        return nacl.sign.detached.verify(messageBytes, signatureBytes, pubKeyBytes);
    } catch (err) {
        console.error("Error verifying message:", err);
        return false;
    }
}

// Periodic validation loop
setInterval(async () => {
    try {
        const websites = await prismaClient.website.findMany({ where: { disabled: false } });

        const tickBatch: any[] = []; // Collect all ticks in a batch

        for (const website of websites) {
            for (const validator of availableValidators) {
                const callbackId = randomUUIDv7();
                console.log(`Sending validate request to validator ${validator.validatorId} for ${website.url}`);

                validator.socket.send(JSON.stringify({
                    type: "validate",
                    data: { url: website.url, callbackId, websiteId: website.id },
                }));

                const validationPromise = new Promise<IncomingMessage>((resolve) => {
                    const timeout = setTimeout(() => {
                        resolve({
                            type: "validate",
                            data: {
                                validatorId: validator.validatorId,
                                websiteId: website.id,
                                callbackId,
                                status: "Bad",
                                latency: 1000,
                                signedMessage: "",
                            },
                        });
                        delete CALLBACKS[callbackId];
                        console.warn(`Validator ${validator.validatorId} timed out for ${website.url}`);
                    }, VALIDATION_TIMEOUT);

                    CALLBACKS[callbackId] = { resolve, timeout };
                });

                const data = await validationPromise;
                // Type guard to ensure data.data has websiteId
                if ("websiteId" in data.data) {
                    tickBatch.push({
                        websiteId: data.data.websiteId,
                        validatorId: data.data.validatorId,
                        status: data.data.status,
                        latency: data.data.latency,
                        createdAt: new Date(),
                    });

                    // Update validator pending payout
                    await prismaClient.validator.update({
                        where: { id: data.data.validatorId },
                        data: { pendingPayouts: { increment: COST_PER_VALIDATION } },
                    });
                }
            }
        }

        // Batch insert all website ticks
        if (tickBatch.length > 0) {
            await prismaClient.websiteTick.createMany({ data: tickBatch, skipDuplicates: true });
            console.log(`Batch recorded ${tickBatch.length} validations`);
        }
    } catch (err) {
        console.error("Error in validation loop:", err);
    }
}, 60 * 1000);
