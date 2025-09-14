import express from "express"
import { authMiddleware } from "./middleware";
import { prismaClient } from "db/client";

const app = express();
app.use(express.json());

// create website
app.post("/api/v1/website", authMiddleware, async (req, res) => {
    const userId = req.userId!;
    const { url } = req.body;

    const data = await prismaClient.website.create({
        data: { userId, url }
    });

    res.json({ id: data.id });
});

// get website status + ticks
app.get("/api/v1/website/status", authMiddleware, async (req, res) => {
    const websiteId = req.query.websiteId! as string;
    const userId = req.userId;

    
    const data = await prismaClient.website.findFirst({
        where: { id: websiteId, userId, disabled: false },
        include: { ticks: true }
    });

    res.json(data);
});

// list all websites
app.get("/api/v1/websites", authMiddleware, async (req, res) => {
    const userId = req.userId!;

    const websites = await prismaClient.website.findMany({
        where: { userId, disabled: false },
        include: { ticks: true }
    });

    res.json({ websites });
});

// soft delete website
app.delete("/api/v1/website/", authMiddleware, async (req, res) => {
    const websiteId = req.body.websiteId;
    const userId = req.userId!;

    await prismaClient.website.update({
        where: { id: websiteId, userId },
        data: { disabled: true }
    });

    res.json({ message: "Deleted website successfully" });
});

// payout route (not implemented yet)
app.post("/api/v1/payout/:validatorId", async (req, res) => {
   // todo
});

app.listen(8080, () => {
    console.log("Server running on http://localhost:8080");
});
