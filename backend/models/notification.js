const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // User to whom the notification is sent
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
});

module.exports = mongoose.model("Notification", notificationSchema);
