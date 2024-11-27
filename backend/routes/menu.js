const express = require("express");
const router = express.Router();
const { addMenu } = require("../controllers/menu.controller"); // Adjust path as needed

// POST route to add a menu
router.post("/add", addMenu);

module.exports = router;
