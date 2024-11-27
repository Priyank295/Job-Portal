const router = require("express").Router();
const auth = require("../middleware/auth");
const authRole = require("../middleware/authRole");

const {
  getAllUsersByRoles,
  changeUserRole,
} = require("../controllers/admin.controller");

router.get("/getUsers", auth, authRole(["Admin"]), getAllUsersByRoles);
router.put(
  "/changeUserRole/:userId",
  auth,
  authRole(["Admin"]),
  changeUserRole
);

module.exports = router;
