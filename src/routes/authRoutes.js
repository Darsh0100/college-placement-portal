const express = require("express");

const router = express.Router();

const { registerUser,loginUser } = require("../controllers/authController");
const {auth,isStudent,isRecruiter,isAdmin}=require("../middleware/authMiddleware");
const { saveCompanyDetails } = require("../controllers/recruiterController");


router.post("/register", registerUser);
router.post("/login",loginUser);

router.get("/register", (req, res) => {
  res.send("Register GET Route Working");
});
//protected routes
router.get("/student",auth,isStudent,(req,res)=>{
  res.status(200).json({
      success:true,
      message:"access to students",
  })
})

router.get("/recruiter",auth,isRecruiter,(req,res)=>{
  res.status(200).json({
      success:true,
      message:"access to recruiter",
  })
})
router.get("/admin",auth,isAdmin,(req,res)=>{
  res.status(200).json({
      success:true,
      message:"access to Admin",
  })
})


// Route to handle the submission of the extended company details form
router.post("/recruiter/company-details", auth, isRecruiter, async (req, res) => {
  try {
      res.status(200).json({
      success: true,
      message: "Company profile details saved successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while saving company details",
      error: error.message,
    });
  }
});



module.exports = router;
