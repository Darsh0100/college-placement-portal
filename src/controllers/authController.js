const User = require("../models/User");
const Company=require("../models/company");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  // Add a quick log to verify the backend is receiving the request
  console.log("Registration request received body:", req.body);

  try {
    const { name, email, password, role, branch, cgpa, resumeUrl, skills } = req.body;

    // 1. Validation
    if (!name || !email || !password || !branch || !cgpa ) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already registered with this email.",
      });
    }

    // 3. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create User
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "student",
      branch,                  // Passed directly at root level
      cgpa: Number(cgpa),      // Passed directly at root level
      skills: skills || [],    // Passed directly at root level
    });

    // 5. Generate Auth JWT Token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET || "YOUR_FALLBACK_SECRET_IF_NOT_IN_ENV",
      { expiresIn: "24h" }
    );

    // 🌟 CRITICAL: You MUST explicitly return this JSON response to unlock the frontend fetch!
    return res.status(201).json({
      success: true,
      message: "Student registered successfully!",
      token,
      user: { name: newUser.name, email: newUser.email, role: newUser.role },
    });

  } catch (error) {
    // If your code throws a database validation or configuration error, it ends up here
    console.error("CRITICAL REGISTRATION ERROR:", error);
    
    // 🌟 CRITICAL: If you don't return a response here, the server hangs on errors!
    return res.status(500).json({
      success: false,
      message: "Internal server registry error.",
      error: error.message
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }


    let checkUser = await User.findOne({ email });

    if (!checkUser) {
      return res.status(401).json({
        success: false,
        message: "User not registered",
      });
    }

    const isMatch = await bcrypt.compare(password, checkUser.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Password incorrect",
      });
    }

    const payload = {
      id: checkUser._id,
      email: checkUser.email,
      role: checkUser.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    checkUser = checkUser.toObject();
    checkUser.password = undefined;

    return res.status(200).json({
      success: true,
      message: `User logged in successfully as ${checkUser.role}`,
      token,
      user:checkUser,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const registerRecruiter = async (req, res) => {
  try {
    const {  
      password,
      RecruiterEmail, // 🌟 Extracted correctly here
      CompanyName, 
      CompanyEmail, 
      companyWebsite, 
      industry, 
      description,
      foundedYear
    } = req.body;

    // 1. Validate mandatory fields for both Account and Company profiles
    if (!RecruiterEmail || !password || !CompanyName || !CompanyEmail || !industry || !description) {
      return res.status(400).json({
        success: false,
        message: "All mandatory profile and company parameters are required.",
      });
    }

    // 2. Enforce global email unique check constraints
    const lowerEmail = RecruiterEmail.toLowerCase(); // 🌟 FIXED: Changed from RecuriterEmail
    const existingUser = await User.findOne({ email: lowerEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email address already exists.",
      });
    }

    // 3. Enforce corporate profile unique checks
    const existingCompany = await Company.findOne({
      $or: [
        { CompanyName: CompanyName },
        { CompanyEmail: CompanyEmail.toLowerCase() }
      ]
    });
    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: "A corporate workspace with that name or email is already registered.",
      });
    }

    // 4. Secure the plaintext password string
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

// 5. Transaction Phase A: Create the Recruiter User account node
const newRecruiter = await User.create({
  name: CompanyName,    // 🌟 FIX: Satisfies the required name path constraint
  password: hashedPassword,
  email: RecruiterEmail,
  role: "recruiter", 
});

    // 6. Transaction Phase B: Create the associated Corporate model profile entry
    const newCompany = await Company.create({
      userId: newRecruiter._id, 
      CompanyName,
      CompanyEmail: CompanyEmail.toLowerCase(),
      companyWebsite,
      industry,
      description,
      foundedYear: foundedYear || null
    });

    // Strip password trace before dispatching downstream
    newRecruiter.password = undefined;

    return res.status(201).json({
      success: true,
      message: "Recruiter profile and corporate workspace initialized successfully!",
      user: newRecruiter,
      company: newCompany
    });

  } catch (error) {
    console.error("RECRUITER STEPPED REGISTRATION CRASH:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  loginUser,registerUser,registerRecruiter
};
