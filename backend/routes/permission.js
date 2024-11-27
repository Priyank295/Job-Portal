const express = require("express");
const {
  getMenusByRole,
  updateRolePermissions,
  getAllRolePermissions,
} = require("../controllers/permission.controller");

const router = express.Router();

router.get("/:role", getMenusByRole);
router.put("/", updateRolePermissions);
router.get("/", getAllRolePermissions);

module.exports = router;
