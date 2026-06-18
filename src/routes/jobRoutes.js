const express = require("express");

const router = express.Router();

const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getRecruiterJobs,
} = require("../controllers/jobController");
const { auth, isRecruiter } = require("../middleware/authMiddleware");
router.post("/create", auth, isRecruiter, createJob);

router.get("/", getAllJobs);
router.get("/my-jobs", auth, isRecruiter, getRecruiterJobs);
router.get("/:id", getJobById);
router.put("/:id", auth, isRecruiter, updateJob);
router.delete("/:id", auth, isRecruiter, deleteJob);
module.exports = router;
