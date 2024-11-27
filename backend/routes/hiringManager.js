const router = require("express").Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const authRole = require("../middleware/authRole");

const {
  approveJob,
  approveCandidateHiring,
  pendingJobs,
  getApprovedApplications,
  rejectJob,
  rejectHiring,
} = require("../controllers/hiring-manager.controller");

router.post(
  "/approveJob/:jobId",
  auth,
  authRole(["Hiring_Manager"]),
  approveJob
);

router.get("/pendingJobs", auth, authRole(["Hiring_Manager"]), pendingJobs);

router.post(
  "/:jobId/hire/:candidateId",
  auth,
  authRole(["Hiring_Manager"]), // Ensure only Hiring Managers can call this API
  approveCandidateHiring
);

router.get(
  "/getApprovedApplications",
  auth,
  authRole(["Hiring_Manager"]),
  getApprovedApplications
);

router.post(
  "/reject-job/:jobId",
  auth,
  authRole(["Hiring_Manager"]), // Only users with the "Hiring Manager" role can access this
  rejectJob
);

router.post(
  "/reject-hiring/:jobId/:applicationId",
  auth,
  authRole("Hiring_Manager"), // Only users with the "Hiring Manager" role can access this
  rejectHiring
);
module.exports = router;
