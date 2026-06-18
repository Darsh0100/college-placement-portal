const express = require("express");

const jobRoutes = require("./routes/jobRoutes");
const authRoutes = require("./routes/authRoutes");

const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

module.exports = app;
