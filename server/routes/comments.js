const express = require("express");
const router = express.Router();
const Comment = require("../models/comment");

// GET comments for a specific location
router.get("/", async (req, res) => {
    const { locationId } = req.query;
  
    if (!locationId) {
      return res.status(400).json({ error: "locationId is required" });
    }
  
    try {
      const comments = await Comment.find({ locationId }).sort({ createdAt: -1 }); // Fetch comments by locationId, sorted by most recent
      res.status(200).json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

// POST a new comment
router.post("/", async (req, res) => {
    const { locationId, text, username } = req.body;
  
    if (!locationId || !text || !username) {
      return res.status(400).json({ error: "locationId, text, and username are required" });
    }
  
    try {
      const newComment = new Comment({ locationId, text, username });
      const savedComment = await newComment.save();
      res.status(201).json(savedComment); // Return the saved comment
    } catch (error) {
      console.error("Error posting comment:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

module.exports = router;