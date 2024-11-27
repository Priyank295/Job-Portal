const router = require("express").Router();
const auth = require("../middleware/auth");
const authRole = require("../middleware/authRole");
const {
  createJob,
  approveCandidateApplication,
  getAllJobApplications,
  rejectApplication,
} = require("../controllers/recruiter.controller");

router.post("/create-job", auth, authRole(["Recruiter"]), createJob);

router.post(
  "/:jobId/approve/:candidateId",
  auth,
  authRole(["Recruiter"]), // Ensure only Recruiters can call this API
  approveCandidateApplication
);

router.get(
  "/getAllJobApplications",
  auth,
  authRole(["Recruiter"]),
  getAllJobApplications
);

router.post(
  "/reject-application/:jobId/:candidateId",
  auth,

  rejectApplication
);
module.exports = router;
