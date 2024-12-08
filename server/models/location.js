const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: String,
  latitude: Number,
  longitude: Number,
});

module.exports = mongoose.model("Location", locationSchema);
