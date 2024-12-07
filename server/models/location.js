const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  name: String,
  latitude: Number,
  longitude: Number,
  lastUpdated: Date,
  events: [
    {
      title: String,
      dateTime: String,
      description: String,
      presenter: String,
    },
  ],
});

module.exports = mongoose.model("Location", locationSchema);
