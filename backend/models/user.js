const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: "Candidate" }, // Default role
  appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }], // Jobs applied
});

module.exports = mongoose.model("User", userSchema);
