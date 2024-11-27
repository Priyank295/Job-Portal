const Menu = require("../models/menu"); // Assuming the model is in models/menuModel.js

// Controller to add a menu
exports.addMenu = async (req, res) => {
  try {
    const { name, label, sequence } = req.body;

    // Validate required fields
    if (!name || !label) {
      return res
        .status(400)
        .json({ error: "Name, label, and role are required." });
    }

    // Create a new menu item
    const newMenu = new Menu({
      name,
      label,
      sequence: sequence || 0, // Default sequence
    });

    // Save to the database
    const savedMenu = await newMenu.save();

    res.status(201).json({
      message: "Menu added successfully.",
      menu: savedMenu,
    });
  } catch (error) {
    console.error("Error adding menu:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
