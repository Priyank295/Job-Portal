const Menu = require("../models/menu");
const Permission = require("../models/permission");

// Get all menus and permissions for a specific role
exports.getMenusByRole = async (req, res) => {
  try {
    const { role } = req.params;

    // Fetch all menus and corresponding permissions for the role
    const permissions = await Permission.find({ role }).populate("menu");

    res.status(200).json(permissions);
  } catch (error) {
    console.error("Error fetching permissions:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

// Update permissions for a role
exports.updateRolePermissions = async (req, res) => {
  try {
    const { role, permissions } = req.body; // permissions: [{ menuId, permission }]

    // Update or create permissions for the role
    await Promise.all(
      permissions.map(async (perm) => {
        await Permission.findOneAndUpdate(
          { role, menu: perm.menuId },
          { permission: perm.permission },
          { upsert: true }
        );
      })
    );

    res.status(200).send("Permissions updated successfully.");
  } catch (error) {
    console.error("Error updating permissions:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

// Get permissions for all roles
exports.getAllRolePermissions = async (req, res) => {
  try {
    const permissions = await Permission.find().populate("menu");
    res.status(200).json(permissions);
  } catch (error) {
    console.error("Error fetching all role permissions:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
