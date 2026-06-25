import React, { useState, useEffect } from "react";
import {
  Briefcase,
  FileText,
  User,
  Search,
  MapPin,
  Clock,
  IndianRupee,
  Upload,
  Check,
  LogOut,
  Calendar,
  BookOpen,
  X,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import target from "../assets/target.png";
import ChatBot from "../components/ChatBot";
const STATUS_STYLE = {
  Applied: "bg-amber-50 text-amber-700 border-amber-200",
  Shortlisted: "bg-blue-50 text-blue-700 border-blue-200",
  Selected: "bg-green-50 text-green-700 border-green-200",
  Rejected: "bg-red-50 text-red-700 border-red-200",
};

// ─── Reusable Input ─────────────────────────────────────────────────────────
function InputWithIcon({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        {...props}
      />
    </div>
  );
}

// ─── Job Card ───────────────────────────────────────────────────────────────
function JobCard({ job, applied, onApply, onView }) {
  const displayCompanyName =
    typeof job.company === "object" && job.company !== null
      ? job.company?.CompanyName || job.company?.name
      : typeof job.company === "string"
      ? job.company
      : "Unknown Company";

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900">{job.title}</h3>
          <p className="text-sm font-medium text-blue-700">
            {displayCompanyName}
          </p>
        </div>
        <span className="whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
          {job.jobType || job.type || "Full-Time"}
        </span>
      </div>

      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-500">
        {job.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          {job.location}
        </span>
        <span className="flex items-center gap-1">
          <IndianRupee className="h-3.5 w-3.5" />
          {job.salary}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          Apply by {job.applicationDeadline || job.deadline}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {job.skills?.map((s) => (
          <span
            key={s}
            className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700"
          >
            {s}
          </span>
        ))}
      </div>

      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={() => onView(job)}
          className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          View details
        </button>
        {applied ? (
          <div className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-green-200 bg-green-50 py-2.5 text-sm font-semibold text-green-700">
            <Check className="h-4 w-4" /> Applied
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onApply(job)}
            className="flex-1 rounded-xl bg-blue-900 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            Apply Now
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Apply Modal ─────────────────────────────────────────────────────────────
function ApplyModal({ job, onClose, onConfirm, showToast, loading }) {
  const [coverLetter, setCoverLetter] = useState("");
  const [modalResumeFile, setModalResumeFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!modalResumeFile) {
      showToast("Please upload your resume PDF to submit.", "error");
      return;
    }
    onConfirm({ coverLetter, resumeFile: modalResumeFile });
  };

  const displayCompanyName =
    typeof job.company === "object" && job.company !== null
      ? job.company?.CompanyName || job.company?.name
      : typeof job.company === "string"
      ? job.company
      : "Unknown Company";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="text-lg font-bold text-slate-900">
            Apply for Position
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <p className="text-sm text-slate-500">
              You are applying for{" "}
              <span className="font-semibold text-slate-900">{job.title}</span>{" "}
              at{" "}
              <span className="font-semibold text-blue-700">
                {displayCompanyName}
              </span>
              .
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Upload Resume (PDF Required){" "}
              <span className="text-red-500">*</span>
            </label>
            {modalResumeFile ? (
              <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                <div className="flex items-center gap-2 truncate">
                  <FileText className="h-4 w-4 text-green-700 shrink-0" />
                  <span className="font-medium truncate">
                    {modalResumeFile.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setModalResumeFile(null)}
                  className="ml-2 text-xs font-bold text-red-500 hover:underline shrink-0"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 text-center transition hover:border-blue-400">
                <Upload className="h-5 w-5 text-slate-400" />
                <p className="mt-1 text-xs font-medium text-blue-700">
                  Click to select file
                </p>
                <input
                  type="file"
                  required
                  accept=".pdf"
                  onChange={(e) => setModalResumeFile(e.target.files[0])}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Short Note / Message (Optional)
            </label>
            <textarea
              rows={3}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Briefly pitch yourself or list relevant technical focus skills..."
              className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="mt-6 flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || !modalResumeFile}
              className="flex-1 rounded-xl bg-blue-900 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="opacity-25"
                    />
                    <path
                      fill="currentColor"
                      className="opacity-75"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  <span>Submitting...</span>
                </>
              ) : (
                "Confirm & Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Job Detail Modal ─────────────────────────────────────────────────────────
function JobDetailModal({ job, applied, onClose, onApply }) {
  const hasCompanyObj = typeof job.company === "object" && job.company !== null;

  const displayCompanyName = hasCompanyObj
    ? job.company.CompanyName || job.company.name
    : typeof job.company === "string"
    ? job.company
    : "Unknown Company";

  const companyEmail = hasCompanyObj ? job.company.CompanyEmail : null;
  const industrySector = hasCompanyObj ? job.company.industry : null;
  const recruiterId =
    job.recruiter || (hasCompanyObj ? job.company.userId : "N/A");

  const rawDeadline = job.applicationDeadline || job.deadline;
  let displayDeadline = "N/A";
  if (rawDeadline) {
    try {
      displayDeadline = new Date(rawDeadline).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      displayDeadline = String(rawDeadline);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <p className="text-xl font-bold text-blue-900">
              {displayCompanyName}
            </p>
            {industrySector && typeof industrySector === "string" && (
              <p className="text-xs font-semibold text-slate-400 mt-0.5">
                {industrySector} Industry
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <IndianRupee className="h-3.5 w-3.5 text-slate-400" />
                {job.salary}
              </span>
              <span className="flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                <Calendar className="h-3.5 w-3.5" /> Deadline: {displayDeadline}
              </span>
            </div>
          </div>
          <hr className="border-slate-100" />
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Role Description
            </p>
            <p className="text-sm leading-relaxed text-slate-600 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
              {job.description}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 rounded-xl border border-slate-100 bg-slate-50/30 p-3.5 text-xs">
            <div>
              <p className="font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                Corporate Email
              </p>
              <p className="font-medium text-slate-700 truncate">
                {typeof companyEmail === "string"
                  ? companyEmail
                  : "Not Provided"}
              </p>
            </div>
            <div>
              <p className="font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                Recruiter Reference ID
              </p>
              <p className="font-mono font-medium text-slate-500 truncate">
                {typeof recruiterId === "object"
                  ? recruiterId?.name || "Assigned"
                  : String(recruiterId)}
              </p>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Required Focus Skills
            </p>
            <div className="flex flex-wrap gap-1.5">
              {Array.isArray(job.skills) && job.skills.length > 0 ? (
                job.skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-100"
                  >
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">
                  No specific technical benchmarks listed.
                </span>
              )}
            </div>
          </div>
          <div className="pt-2">
            {applied ? (
              <div className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-green-200 bg-green-50 py-3 text-sm font-semibold text-green-700">
                <Check className="h-4 w-4" /> Already Applied to this Drive
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onApply(job);
                }}
                className="w-full rounded-xl bg-blue-900 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-800 transition"
              >
                Apply Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────
export default function StudentDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const userName = user?.name || "Student";
  const userEmail = user?.email || "";

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState("jobs");
  const [search, setSearch] = useState("");
  const [applyJob, setApplyJob] = useState(null);
  const [viewJob, setViewJob] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Toast State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // Auto hide toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  const fetchJobs = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/jobs");
      const data = await response.json();
      if (data.success) setJobs(data.jobs);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8000/api/v1/applications/my-applications",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (data.success) setApplications(data.applications);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchApplications();
    showToast("User logged in successfully as student", "success");
  }, []);

  const appliedIds = new Set(applications.map((a) => a.jobId || a.job?._id));

  const filteredJobs = jobs.filter((job) => {
    const compName =
      typeof job.company === "object" && job.company !== null
        ? job.company.CompanyName || job.company.name || ""
        : typeof job.company === "string"
        ? job.company
        : "";
    return (
      job.title?.toLowerCase().includes(search.toLowerCase()) ||
      compName.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleApplyConfirm = async (extraDetails) => {
    try {
      setLoading(true);

      if (!extraDetails?.resumeFile) {
        showToast("Please upload your resume PDF to submit.", "error");
        return;
      }

      const token = localStorage.getItem("token");

      if (!token) {
        showToast("Please login first", "error");
        return;
      }

      const formData = new FormData();
      formData.append("jobId", applyJob._id);
      formData.append("resume", extraDetails.resumeFile);

      if (extraDetails?.coverLetter) {
        formData.append("coverLetter", extraDetails.coverLetter);
      }

      const response = await fetch(
        "http://localhost:8000/api/v1/applications/apply",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!data.success) {
        showToast(data.message, "error");
        return;
      }

      showToast(data.message || "Application successful!", "success");
      fetchApplications();
      setApplyJob(null);
    } catch (error) {
      console.error(error);
      showToast("Application failed", "error");
    } finally {
      setLoading(false);
    }
  };

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  const tabs = [
    { key: "jobs", label: "Browse Jobs", icon: Briefcase },
    {
      key: "applications",
      label: `Applications (${applications.length})`,
      icon: FileText,
    },
    { key: "profile", label: "Profile & Resume", icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-50 relative">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-900">
              <img src={target} alt="logo" className="h-6 w-6" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              PlacementXTarget
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-900">{userName}</p>
              <p className="text-xs text-slate-400">Student</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-6">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition ${
                activeTab === key
                  ? "border-blue-900 text-blue-900"
                  : "border-transparent text-slate-400 hover:text-slate-700"
              }`}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        {activeTab === "jobs" && (
          <div>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-2xl font-bold text-slate-900">
                Job Postings
              </h1>
              <div className="relative w-full sm:w-72">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  placeholder="Search roles or companies..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {filteredJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
                <Briefcase className="h-8 w-8 text-blue-200" />
                <p className="mt-3 text-sm font-semibold text-slate-900">
                  No jobs found
                </p>
                <p className="text-sm text-slate-500">
                  Try a different search term.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredJobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    applied={appliedIds.has(job._id)}
                    onApply={setApplyJob}
                    onView={setViewJob}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "applications" && (
          <div>
            <h1 className="mb-6 text-2xl font-bold text-slate-900">
              My Applications
            </h1>
            {applications.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
                <FileText className="h-8 w-8 text-blue-200" />
                <p className="mt-3 text-sm font-semibold text-slate-900">
                  No applications yet
                </p>
                <p className="text-sm text-slate-500">
                  Apply to a job to track it here.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                    <tr>
                      <th className="px-5 py-3 font-semibold">Role</th>
                      <th className="px-5 py-3 font-semibold">Company</th>
                      <th className="px-5 py-3 font-semibold">Applied on</th>
                      <th className="px-5 py-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {applications.map((a) => {
                      const jobTitle =
                        a.job?.title || a.jobTitle || "Unknown Position";
                      let companyName = "Unknown Company";
                      if (typeof a.company === "object" && a.company !== null) {
                        companyName =
                          a.company.CompanyName ||
                          a.company.name ||
                          companyName;
                      } else if (
                        typeof a.job?.company === "object" &&
                        a.job.company !== null
                      ) {
                        companyName =
                          a.job.company.CompanyName ||
                          a.job.company.name ||
                          companyName;
                      } else if (typeof a.company === "string") {
                        companyName = a.company;
                      }

                      const displayDate =
                        a.appliedDate ||
                        (a.createdAt
                          ? new Date(a.createdAt).toLocaleDateString()
                          : "Recent");

                      return (
                        <tr key={a._id || a.jobId}>
                          <td className="px-5 py-4 font-medium text-slate-900">
                            {jobTitle}
                          </td>
                          <td className="px-5 py-4 text-slate-500">
                            {companyName}
                          </td>
                          <td className="px-5 py-4 text-slate-500">
                            {displayDate}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${
                                STATUS_STYLE[a.status] || STATUS_STYLE.Applied
                              }`}
                            >
                              {a.status || "Applied"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "profile" && (
          <div className="max-w-xl">
            <h1 className="mb-6 text-2xl font-bold text-slate-900">
              Profile & Resume
            </h1>
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-900 text-xl font-bold text-white">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900">{userName}</p>
                  <p className="text-sm text-slate-500">{userEmail}</p>
                  <span className="mt-1 inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                    Student
                  </span>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-6">
                <p className="text-sm font-semibold text-slate-700 mb-3">
                  Resume
                </p>
                {resumeFile ? (
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <FileText className="h-4 w-4 text-blue-700 shrink-0" />
                      <span className="truncate max-w-xs">
                        {resumeFile.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setResumeFile(null)}
                      className="ml-2 text-xs font-semibold text-red-500 hover:underline shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                    <Upload className="mx-auto h-6 w-6 text-slate-400" />
                    <p className="mt-2 text-sm font-semibold text-blue-700">
                      Select your resume file
                    </p>
                    <p className="text-xs text-slate-400">
                      PDF, DOC, or DOCX formats
                    </p>
                  </div>
                )}
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="file"
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                {
                  label: "Applied",
                  value: applications.length,
                  icon: Briefcase,
                },
                {
                  label: "Shortlisted",
                  value: applications.filter((a) => a.status === "Shortlisted")
                    .length,
                  icon: BookOpen,
                },
                {
                  label: "Selected",
                  value: applications.filter((a) => a.status === "Selected")
                    .length,
                  icon: Check,
                },
              ].map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white py-5 text-center"
                >
                  <Icon className="h-5 w-5 text-blue-700" />
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {value}
                  </p>
                  <p className="text-xs text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      {applyJob && (
        <ApplyModal
          job={applyJob}
          onClose={() => setApplyJob(null)}
          onConfirm={handleApplyConfirm}
          showToast={showToast}
          loading={loading}
        />
      )}
      {viewJob && (
        <JobDetailModal
          job={viewJob}
          applied={appliedIds.has(viewJob._id)}
          onClose={() => setViewJob(null)}
          onApply={(job) => {
            setViewJob(null);
            setApplyJob(job);
          }}
        />
      )}
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex max-w-sm items-start gap-3 rounded-2xl border bg-white p-4 shadow-xl border-slate-100 transition-all duration-300">
          {toast.type === "error" ? (
            <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
          ) : (
            <Check className="h-5 w-5 shrink-0 text-green-600 mt-0.5" />
          )}
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-900">Notification</p>
            <p className="text-xs text-slate-500 mt-0.5">{toast.message}</p>
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      <ChatBot  />;
    </div>
  );
}
