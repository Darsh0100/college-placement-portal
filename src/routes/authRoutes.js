const express = require("express");

const router = express.Router();

const { registerUser,loginUser } = require("../controllers/authController");
const {auth,isStudent,isRecruiter,isAdmin}=require("../middleware/authMiddleware");


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
router.get("/admin",auth,isAdmin,(req,res)=>{
  res.status(200).json({
      success:true,
      message:"access to Admin",
  })
})
router.get("/admin",auth,isRecruiter,(req,res)=>{
  res.status(200).json({
      success:true,
      message:"access to recruiter",
  })
})

module.exports = router;
