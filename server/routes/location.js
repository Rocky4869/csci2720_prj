const express = require("express");
const Location = require("../models/location");
const router = express.Router();

router.get("/locations", async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
