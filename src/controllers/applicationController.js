

// Inside your application controller file:
const Application = require("../models/application");
const Job = require("../models/job");
const User = require("../models/User"); // 🌟 Make sure to import your User model here!
const cloudinary = require("../config/cloudinary");

const applyToJob = async (req, res) => {
  try {
    console.log("Controller Hit");

    const { id: studentId, branch: studentBranch } = req.user; 
    const { jobId, coverLetter } = req.body; 

    // 1. First, make sure jobId was actually passed
    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "jobId is required in the request body",
      });
    }

    // 2. Fetch the target job from MongoDB
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job position not found",
      });
    }

    // 3. NOW check branch eligibility safely
    if (job.eligibility?.allowedBranches && job.eligibility.allowedBranches.length > 0) {
      if (!job.eligibility.allowedBranches.includes(studentBranch)) {
        return res.status(403).json({ 
          success: false, 
          message: `Your branch (${studentBranch || "Unspecified"}) is not eligible to apply for this position.` 
        });
      }
    }

    // 4. Check if the student already applied to this specific job
    const existingApplication = await Application.findOne({
      student: studentId,
      job: jobId,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied to this job.",
      });
    }

    // 5. Validate that a file buffer was sent by Multer
    if (!req.file) {
      return res.status(400).json({
          success: false,
          message: "Please upload your physical PDF resume file."
      });
    }

    // 6. Upload file payload directly to Cloudinary via streams
    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
              {
                  resource_type: "raw", 
                  folder: "placement_resumes",
                  access_mode: "public"
              },
              (error, result) => {
                  if (result) resolve(result);
                  else reject(error);
              }
          );
          stream.end(req.file.buffer); 
      });
    };

    const uploadedResume = await streamUpload(req);
    const liveResumeUrl = uploadedResume.secure_url;

    // 7. Create Application and populate company properties cleanly
    const application = await Application.create({
      student: studentId,
      job: job._id,
      company: job.company,
      resumeUrl: liveResumeUrl, 
      coverLetter: coverLetter || "",
    });
    
    await application.populate("company");

    // 8. Update the student's profile schema with the URL too
    await User.findByIdAndUpdate(studentId, {
      resumeUrl: liveResumeUrl
    });

    // 9. Increment the live applicant counter on the job listing
    await Job.findByIdAndUpdate(job._id, { $inc: { applicantsCount: 1 } });

    return res.status(201).json({
      success: true,
      message: "Application submitted and profile resume updated successfully!",
      application,
      resumeUrl: liveResumeUrl 
    });

  } catch (error) {
    console.error("APPLICATION SUBMIT CRASH:", error);
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
    const validStatuses = [
      "Applied",
      "Under Review",
      "Shortlisted",
      "Interview Scheduled",
      "Selected",
      "Rejected",
    ];
    
    if(!validStatuses.includes(status)){
       return res.status(400).json({
          success:false,
          message:"Invalid status"
       });
    }

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

const deleteJob = async (req, res) => {
  try {

    const { id: jobId } = req.body;

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

    await Application.deleteMany({
      job: jobId,
    });

    await Job.findByIdAndDelete(jobId);

    return res.status(200).json({
      success: true,
      message: "Job and related applications deleted",
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
  deleteJob,
};
