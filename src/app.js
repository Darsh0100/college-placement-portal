const express = require("express");
const applicationRoutes = require("./routes/applicationRoutes");
const jobRoutes = require("./routes/jobRoutes");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");

app.use(cors({
  origin: "http://localhost:5173", // Replace with your frontend's exact URL
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Backend Running");
});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/applications", applicationRoutes);
module.exports = app;
