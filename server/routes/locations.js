const express = require("express");
const router = express.Router();
const Location = require("../models/location");

// Public route
router.get("/", async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const locationID = req.params.id;
    const location = await Location.findOne({ id: locationID });
    res.json(location);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
