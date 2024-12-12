const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Event = require("../models/event");
const { authenticate, authorize } = require("../middleware/auth");

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

router.post("/:eventId", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { eventId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.likedEvents.includes(eventId)) {
      user.likedEvents.push(eventId);
      console.log(user.likedEvents);
      await user.save();
    } else {
      user.likedEvents = user.likedEvents.filter(
        (id) => id.toString() !== eventId
      );
      console.log(user.likedEvents);
      await user.save();
    }

    res.json(user.likedEvents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
