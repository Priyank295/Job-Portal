const router = require("express").Router();
const auth = require("../middleware/auth");
const authRole = require("../middleware/authRole");
const {
  register,
  login,
  showNotifications,
  applyJob,
  getAllJobs,
  getApplicationStatus,
} = require("../controllers/user.auth.controller");

router.post("/register", register);

router.post("/login", login);

router.get("/inbox", auth, showNotifications);

router.post("/apply/:jobId", auth, authRole(["Candidate"]), applyJob);

router.get("/jobs", auth, getAllJobs);

router.post("/getApplicationStatus", auth, getApplicationStatus);

module.exports = router;
