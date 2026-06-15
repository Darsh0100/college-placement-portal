const User = require("../models/User");

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

    const user = await User.create({
      name,
      email,
      password,
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

module.exports = {
  registerUser,
};
