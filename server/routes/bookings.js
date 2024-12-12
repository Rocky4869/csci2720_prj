const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { authenticate, authorize } = require("../middleware/auth");

router.get("/events", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("registeredEvents");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.registeredEvents);
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

    if (!user.registeredEvents.includes(eventId)) {
      user.registeredEvents.push(eventId);
      await user.save();
    } else {
      user.registeredEvents = user.registeredEvents.filter(
        (id) => id.toString() !== eventId
      );
      await user.save();
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
