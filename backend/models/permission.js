const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["Candidate", "Hiring Manager", "Recruiter", "Employee"],
    required: true,
  },
  menu: { type: mongoose.Schema.Types.ObjectId, ref: "Menu", required: true },
  permission: {
    type: String,
    enum: ["Allow", "Deny", "Undefined"],
    default: "Undefined",
  },
});

module.exports = mongoose.model("Permission", permissionSchema);
