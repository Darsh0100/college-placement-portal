const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req, res, next) => {
  try {
    //extract JWT token

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

    //verify token
    try {
      console.log("TOKEN RECEIVED:", token);
      console.log("JWT SECRET:", process.env.JWT_SECRET);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log("DECODED:", decoded);

      req.user = decoded;
    } catch (error) {
      console.log("JWT ERROR:", error);

      return res.status(401).json({
        success: false,
        message: error.message,
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

exports.isStudent = (req, res, next) => {
  try {
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
