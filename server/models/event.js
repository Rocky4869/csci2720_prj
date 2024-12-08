const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  eventId: { type: Number, required: true, unique: true },
  title: String,
  dateTime: String,
  description: String,
  presenter: String,
  venue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
  },
});

module.exports = mongoose.model("Event", eventSchema);
