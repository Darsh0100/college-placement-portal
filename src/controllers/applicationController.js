const Application = require("../models/application");
const Job = require("../models/job");
const cloudinary=require("../config/cloudinary")

const applyToJob = async (req, res) => {
  try {
    console.log("Controller Hit");

    // 1. Get Student ID from the URL Parameter
    const { Id: studentId } = req.params; 

    // 2. Get the Job ID from the form-data text field sent by the frontend/Postman
    const { jobId } = req.body; 
    console.log(jobId);
    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "jobId is required in the request body",
      });
    }

    if (!req.file) {
      return res.status(400).json({
          success: false,
          message: "Resume is required"
      });
    }

    // 3. Upload to Cloudinary
    const uploadedResume = await cloudinary.uploader.upload(
        req.file.path,
        {
            resource_type: "raw",
            folder: "placement_resumes"
        }
    );

    // 4. Find the job using the ID from the body
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // 5. Create the application matching the student and job together
    const application = await Application.create({
      student: studentId,
      job: job._id,
      company: job.company,
      resumeUrl: uploadedResume.secure_url,
    });

    // 6. Increment applicant count
//  Increment the counter directly in the database without triggering full validation
    await Job.findByIdAndUpdate(job._id, { $inc: { applicantsCount: 1 } });

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });

  } catch (error) {
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
