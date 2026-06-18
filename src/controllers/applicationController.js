const Application = require("../models/application");
const Job = require("../models/job");

const applyToJob = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { jobId, resumeUrl } = req.body;

    if (!jobId || !resumeUrl) {
      return res.status(400).json({
        success: false,
        message: "jobId and resumeUrl are required",
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }
    if (job.status !== "Open") {
      return res.status(400).json({
        success: false,
        message: "This job is no longer accepting applications",
      });
    }
    if (new Date() > job.applicationDeadline) {
      return res.status(400).json({
        success: false,
        message: "Application deadline has passed",
      });
    }

    const existingApplication = await Application.findOne({
      student: studentId,
      job: jobId,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    const application = await Application.create({
      student: studentId,
      job: job._id,
      company: job.company,
      resumeUrl,
    });

    job.applicantsCount += 1;
    await job.save();

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      student: req.user.id,
    })
      .populate({
        path: "job",
        populate: {
          path: "company",
        },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getApplicantsForJob = async (req, res) => {
  try {
    const { jobId } = req.params;

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
        message: "Unauthorized access",
      });
    }

    const applications = await Application.find({
      job: jobId,
    })
      .populate("student", "name email skills branch cgpa resumeUrl")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const application = await Application.findById(applicationId).populate(
      "job"
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (application.job.recruiter.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    application.status = status;

    await application.save();

    return res.status(200).json({
      success: true,
      message: "Status updated successfully",
      application,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  applyToJob,
  getMyApplications,
  getApplicantsForJob,
  updateApplicationStatus,
};
