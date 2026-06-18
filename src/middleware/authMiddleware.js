const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req, res, next) => {
  try {
    const token =
      req.header("Authorization")?.replace("Bearer ", "") ||
      req.cookies?.token ||
      req.body?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "token not available",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};

exports.isStudent = (req, res, next) => {
  try {
    if (req.user.role != "student") {
      return res.status(401).json({
        success: false,
        message: "this is protected route for student",
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.isRecruiter = (req, res, next) => {
  try {
    if (req.user.role != "recruiter") {
      return res.status(401).json({
        success: false,
        message: "this is protected route for recruiter",
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.isAdmin = (req, res, next) => {
  try {
    if (req.user.role != "admin") {
      return res.status(401).json({
        success: false,
        message: "this is protected route for admin",
      });
    }
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};
