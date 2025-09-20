import express from "express";
import { authMiddleware } from "./middleware";
import { prismaClient } from "db/client";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// Create a new website
app.post("/api/v1/website", authMiddleware, async (req, res) => {
  const userId = req.userId!;
  const { url } = req.body;

  try {
    const data = await prismaClient.website.create({
      data: {
        userId,
        url,
      },
    });

    res.json({ id: data.id });
  } catch (err) {
    console.error("Create website error:", err);
    res.status(500).json({ error: "Failed to create website" });
  }
});

// Get status of a website
app.get("/api/v1/website/status", authMiddleware, async (req, res) => {
  const websiteId = req.query.websiteId as string;
  const userId = req.userId!;

  try {
    const data = await prismaClient.website.findFirst({
      where: { id: websiteId, userId, disabled: false },
      include: { ticks: true },
    });

    if (!data) return res.status(404).json({ error: "Website not found" });

    res.json(data);
  } catch (err) {
    console.error("Get website status error:", err);
    res.status(500).json({ error: "Failed to fetch website status" });
  }
});

// Get all websites of a user
app.get("/api/v1/websites", authMiddleware, async (req, res) => {
  const userId = req.userId!;

  try {
    const websites = await prismaClient.website.findMany({
      where: { userId, disabled: false },
      include: { ticks: true },
    });

    res.json({ websites });
  } catch (err) {
    console.error("Get websites error:", err);
    res.status(500).json({ error: "Failed to fetch websites" });
  }
});

// Delete website (soft delete)
app.delete("/api/v1/website", authMiddleware, async (req, res) => {
  const { websiteId } = req.body;
  const userId = req.userId!;

  try {
    const result = await prismaClient.website.updateMany({
      where: { id: websiteId, userId },
      data: { disabled: true },
    });

    if (result.count === 0) return res.status(404).json({ error: "Website not found" });

    res.json({ message: "Deleted website successfully" });
  } catch (err) {
    console.error("Delete website error:", err);
    res.status(500).json({ error: "Failed to delete website" });
  }
});

// Edit website URL
app.put("/api/v1/website", authMiddleware, async (req, res) => {
  const { websiteId, url } = req.body;
  const userId = req.userId!;

  if (!websiteId || !url) {
    return res.status(400).json({ error: "websiteId and url are required" });
  }

  try {
    const result = await prismaClient.website.updateMany({
      where: { id: websiteId, userId },
      data: { url },
    });

    if (result.count === 0) return res.status(404).json({ error: "Website not found" });

    res.json({ message: "Website updated successfully" });
  } catch (err) {
    console.error("Update website error:", err);
    res.status(500).json({ error: "Failed to update website" });
  }
});

// Start server
app.listen(8080, () => console.log("API server running on http://localhost:8080"));
