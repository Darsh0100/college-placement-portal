const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, branch, cgpa, skills, resumeUrl } =
      req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      branch,
      cgpa,
      skills,
      resumeUrl,
    });

    res.status(201).json({
      message: "User Registered Successfully",
      user,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};



//login Controller


const jwt=require("jsonwebtoken");
require("dotenv").config();

const loginUser=async(req,res)=>{
    try{
        const{email,password}=req.body;
        let checkUser=await User.findOne({email});
        if(!checkUser){
            return res.status(401).json({
                success:false,
                message:"User not registered",
            })
        }
        const isMatch=await bcrypt.compare(password,checkUser.password);
        if(!isMatch){
            return res.status(401).json({
                success:false,
                message:"password incorrect",
            })
        }
        const payload={
            id: checkUser._id,
            email: checkUser.email,
            role:checkUser.role,
        }
        const token = jwt.sign(payload,
            process.env.JWT_SECRET, 
            {
                expiresIn: "24h"
            },
        );
        checkUser=checkUser.toObject();
        checkUser.password=undefined;
        const options={
            expires:new Date(Date.now()+3*24*60*60*1000),
            httpOnly:true,
        }
        return res.cookie("token",token,options).status(200).json({
            success:true,
            message:`user logged in successfully as ${checkUser.role}`,
            token,
            checkUser,
        });
}
    catch(err){
        res.status(500).json({
            success:false,
            message:err.message,
        })
    }
}

module.exports = {
  registerUser, loginUser,
};