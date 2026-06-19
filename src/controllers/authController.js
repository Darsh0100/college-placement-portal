const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  // register logic
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

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
      checkUser,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
