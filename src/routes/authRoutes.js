const express = require("express");

const router = express.Router();

const { registerUser, loginUser } = require("../controllers/authController");

const {
  auth,
  isStudent,
  isRecruiter,
  isAdmin,
} = require("../middleware/authMiddleware");

const { saveCompanyDetails } = require("../controllers/recruiterController");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/student", auth, isStudent, (req, res) => {
  res.status(200).json({
    success: true,
    message: "access to students",
  });
});

router.get("/recruiter", auth, isRecruiter, (req, res) => {
  res.status(200).json({
    success: true,
    message: "access to recruiter",
  });
});

router.get("/admin", auth, isAdmin, (req, res) => {
  res.status(200).json({
    success: true,
    message: "access to Admin",
  });
});

router.post(
  "/recruiter/company-details",
  auth,
  isRecruiter,
  saveCompanyDetails
);

module.exports = router;
