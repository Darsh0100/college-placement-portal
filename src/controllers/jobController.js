const Job = require("../models/job");
const Company = require("../models/company");
const axios = require("axios");
const syncWithRAG = async (method, url, payload) => {
  try {
    console.log(`========== ${method} ${url} ==========`);

    let response;

    if (method === "POST") {
      response = await axios.post(url, payload);
    } else if (method === "PUT") {
      response = await axios.put(url, payload);
    } else if (method === "DELETE") {
      response = await axios.delete(url, {
        data: payload,
      });
    }

    console.log("RAG SUCCESS:", response.data);
    console.log("====================================");
  } catch (err) {
    console.log("========== RAG ERROR ==========");
    console.log("Message:", err.message);

    if (err.response) {
      console.log("Status:", err.response.status);
      console.log("Data:", err.response.data);
    }

    console.log("===============================");
  }
};
const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      skills,
      jobType,
      salary,
      openings,
      eligibility,
      applicationDeadline,
      location,
    } = req.body;
    if (!title || !description || !jobType || !salary || !applicationDeadline) {
      return res.status(400).json({
        success: false,
        message: "All required fields are mandatory",
      });
    }
    const recruiterId = req.user.id;

    const recruiterCompany = await Company.findOne({
      userId: recruiterId,
    }).populate("userId"); // 🌟 Chained outside the findOne object, passed as a string

    if (!recruiterCompany) {
      return res.status(404).json({
        success: false,
        message: "Please create company profile first",
      });
    }

    const job = await Job.create({
      title,
      company: recruiterCompany._id,
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
    await syncWithRAG("POST", "http://127.0.0.1:8001/add-job", {
      jobId: job._id.toString(),
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
    const jobs = await Job.find()
      .populate("company")
      .populate("recruiter", "name email")
      .sort({ createdAt: -1 });

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
    const job = await Job.findById(req.params.id)
      .populate("company")
      .populate("recruiter", "name email");

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
    delete req.body.company;
    delete req.body.recruiter;
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
    await syncWithRAG("PUT", "http://127.0.0.1:8001/update-job", {
      jobId,
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
    await syncWithRAG("DELETE", process.env.FASTAPI_URL, {
      jobId,
    });
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
    })
      .populate("company")
      .populate("recruiter", "name email")
      .sort({ createdAt: -1 });

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
