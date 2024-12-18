const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  likedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }], // Events liked by the user
  registeredEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }], // Events the user registered for
  favLocation: [{ type: mongoose.Schema.Types.ObjectId, ref: "Location" }], // Favorite locations
});

// Middleware to hash the password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare provided password with hashed password in the database
userSchema.methods.comparePassword = async function (password) {
  try {
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
  } catch (err) {
    console.error(err);
    return false;
  }
};

module.exports = mongoose.model("User", userSchema);