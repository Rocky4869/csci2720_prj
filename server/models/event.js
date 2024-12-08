const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
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
