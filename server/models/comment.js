const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  locationId: {
    type: String, // Reference to the location's unique ID
    required: true,
  },
  text: {
    type: String, // The comment text
    required: true,
  },
  username: {
    type: String, // The username of the commenter
    required: true, // Make it mandatory
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the creation date
  },
});

module.exports = mongoose.model("Comment", CommentSchema);