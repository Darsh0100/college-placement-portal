const express = require("express");
const applicationRoutes = require("./routes/applicationRoutes");
const jobRoutes = require("./routes/jobRoutes");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");
const chatRoutes = require("./routes/chatRoutes");
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174","https://placementdy.netlify.app"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Backend Running");
});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/applications", applicationRoutes);
app.use("/api/v1/chat", chatRoutes);
module.exports = app;
