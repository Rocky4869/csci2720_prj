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
  price: String,
  likeCount: { type: Number, default: 0 }, // Total number of likes for the event
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of user IDs who liked the event
});

module.exports = mongoose.model("Event", eventSchema);