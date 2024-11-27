const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  label: {
    en: { type: String, required: true },
  },
  sequence: { type: Number, default: 0 }, // To order menus
  parentMenu: { type: mongoose.Schema.Types.ObjectId, ref: "Menu" }, // For nested menus
});

module.exports = mongoose.model("Menu", menuSchema);
