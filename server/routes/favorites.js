const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Event = require("../models/event");
const Location = require("../models/location");
const { authenticate, authorize } = require("../middleware/auth");

router.get("/", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("favLocation");
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.favLocation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/:locationId", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { locationId } = req.params;

    const user = await User.findById(userId);

    const location = await Location.findById({ _id: locationId });

    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.favLocation.includes(locationId)) {
      user.favLocation.push(locationId);
      await user.save();
    } else {
      user.favLocation = user.favLocation.filter(
        (location) => location._id.toString() !== locationId
      );
      await user.save();
    }

    res.json(user.favLocation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
