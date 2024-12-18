// ..router/user.js
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { authenticate, authorize } = require("../middleware/auth");

// Get all users (admin only)
router.post("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new user (admin only)
router.post("/create", authenticate, authorize(["admin"]), async (req, res) => {
  try {
    const { username, password, email, role } = req.body;

    // Check if username or email already exists
    const existingUser = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    const newUser = new User({
      username,
      password,
      email,
      role: role || "user",
      likedEvents: [],
      registeredEvents: [],
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update user (admin only)
router.put("/:id", authenticate, authorize(["admin"]), async (req, res) => {
  try {
    const { username, password, email, role, likedEvents, registeredEvents } =
      req.body;
    const userId = req.params.id;

    const user = await User.findOne({ username: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if new username conflicts with existing users
    if (username != user.username) {
      const existingUsername = await User.findOne({ username: username });

      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
    }

    // Check if new email conflicts with existing users
    if (email != user.email) {
      const existingEmail = await User.findOne({ email: email });

      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    const updatedUser = {
      username: username,
      password: password,
      email: email,
      role: role,
      likedEvents: likedEvents,
      registeredEvents: registeredEvents,
    };

    await User.findOneAndUpdate({ username: userId }, updatedUser, {
      new: true,
    });

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete user (admin only)
router.delete("/:id", authenticate, authorize(["admin"]), async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(userId);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
