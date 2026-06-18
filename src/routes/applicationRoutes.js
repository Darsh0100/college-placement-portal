const express = require("express");

const router = express.Router();
const {
  auth,
  isStudent,
  isRecruiter,
} = require("../middleware/authMiddleware");
const {
  applyToJob,
  getMyApplications,
  updateApplicationStatus,
  getApplicantsForJob,
} = require("../controllers/applicationController");

router.post("/apply", auth, isStudent, applyToJob);
router.get("/my-applications", auth, isStudent, getMyApplications);
router.get("/job/:jobId", auth, isRecruiter, getApplicantsForJob);

router.put(
  "/status/:applicationId",
  auth,
  isRecruiter,
  updateApplicationStatus
);
module.exports = router;
