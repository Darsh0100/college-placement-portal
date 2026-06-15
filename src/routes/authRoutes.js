const express = require("express");

const router = express.Router();

const { registerUser } = require("../controllers/authController");

router.post("/register", registerUser);

router.get("/register", (req, res) => {
  res.send("Register GET Route Working");
});

module.exports = router;
