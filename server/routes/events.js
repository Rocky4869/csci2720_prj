const express = require("express");
const router = express.Router();
const Event = require("../models/event");
const Location = require("../models/location");

router.get("/", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const eventID = req.params.id;
    const event = await Event.findOne({ eventId: eventID }).populate("venue");
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, dateTime, description, presenter, venue } = req.body;
    const location = await Location.findOne({ name: venue });
    const eventId = (await Event.countDocuments()) + 1;

    if (!location) {
      res.status(404).json({ message: "Location not found" });
      return;
    }

    const newEvent = new Event({
      eventId: eventId,
      title: title,
      dateTime: dateTime,
      description: description,
      presenter: presenter,
      venue: location._id,
    });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const eventID = req.params.id;
    const event = await Event.findOneAndDelete({ eventId: eventID });

    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const eventID = req.params.id;
    const { title, dateTime, description, presenter, venue } = req.body;
    const location = await Location.findOne({
      name: venue,
    });
    const updatedEvent = {
      title: title,
      dateTime: dateTime,
      description: description,
      presenter: presenter,
      venue: location._id,
    };
    await Event.findOneAndUpdate({ eventId: eventID }, updatedEvent, {
      new: true,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
