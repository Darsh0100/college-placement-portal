const express = require("express");

const router = express.Router();

const { registerUser, loginUser } = require("../controllers/authController");
const {
  auth,
  isStudent,
  isRecruiter,
  isAdmin,
} = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/student", auth, isStudent, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Access to Student Route",
  });
});

router.get("/recruiter", auth, isRecruiter, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Access to Recruiter Route",
  });
});

router.get("/admin", auth, isAdmin, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Access to Admin Route",
  });
});
