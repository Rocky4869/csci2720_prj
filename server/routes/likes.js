const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Event = require("../models/event");
const { authenticate } = require("../middleware/auth");

// Get all events liked by the authenticated user
router.get("/events", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("likedEvents");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.likedEvents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Like or Unlike an event
router.post("/:eventId", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { eventId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (!user.likedEvents.includes(eventId)) {
      // Add event to user's likedEvents and increment likeCount
      user.likedEvents.push(eventId);
      event.likedBy.push(userId);
      event.likeCount += 1;
    } else {
      // Remove event from user's likedEvents and decrement likeCount
      user.likedEvents = user.likedEvents.filter(
        (id) => id.toString() !== eventId
      );
      event.likedBy = event.likedBy.filter((id) => id.toString() !== userId);
      event.likeCount -= 1;
    }

    await user.save();
    await event.save();

    res.json({
      likedEvents: user.likedEvents,
      likeCount: event.likeCount, // Return the updated like count
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;