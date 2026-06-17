const Job = require("../models/job");
const User = require("../models/User");

const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      description,
      skills,
      jobType,
      salary,
      openings,
      eligibility,
      applicationDeadline,
      location,
    } = req.body;
    if (
      !title ||
      !company ||
      !description ||
      !jobType ||
      !salary ||
      !applicationDeadline
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields are mandatory",
      });
    }
    const recruiterId = req.user.id;

    const job = await Job.create({
      title,
      company,
      recruiter: recruiterId,
      description,
      skills,
      jobType,
      salary,
      openings,
      eligibility,
      applicationDeadline,
      location,
    });

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.recruiter.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(jobId, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      updatedJob,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.recruiter.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await Job.findByIdAndDelete(jobId);

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getRecruiterJobs = async (req, res) => {
  try {
    const recruiterId = req.user.id;

    const jobs = await Job.find({
      recruiter: recruiterId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getRecruiterJobs,
};
