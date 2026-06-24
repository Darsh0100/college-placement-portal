import React, { useState, useEffect } from "react";
import { 
  Briefcase, PlusCircle, Building, Users, FileText, 
  Check, X, Calendar, AlertCircle, LogOut, ExternalLink, MapPin, DollarSign
} from "lucide-react";
import target from "../assets/target.png";
import { useNavigate } from "react-router-dom";

const STATUS_OPTIONS = [
  "Applied", "Under Review", "Shortlisted", "Interview Scheduled", "Selected", "Rejected"
];

const STATUS_STYLE = {
  Applied: "bg-amber-50 text-amber-700 border-amber-200",
  "Under Review": "bg-purple-50 text-purple-700 border-purple-200",
  Shortlisted: "bg-blue-50 text-blue-700 border-blue-200",
  "Interview Scheduled": "bg-indigo-50 text-indigo-700 border-indigo-200",
  Selected: "bg-green-50 text-green-700 border-green-200",
  Rejected: "bg-red-50 text-red-700 border-red-200",
};

export default function RecruiterDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // ─── UI Layout States ──────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("jobs");
  const [postedJobs, setPostedJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // ─── Toast System State ────────────────────────────────────────────────────
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // Automatically dismiss toasts after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  
  // ─── Form Binding States ───────────────────────────────────────────────────
  const [jobForm, setJobForm] = useState({
    title: "", description: "", location: "", salary: "", jobType: "Full-Time", 
    openings: 1, applicationDeadline: "", skills: "", minCGPA: 0, allowedBranches: "", maxBacklogs: 0
  });

  const [companyForm, setCompanyForm] = useState({
    CompanyName: "", CompanyEmail: "", companyWebsite: "", industry: "", description: ""
  });

  // Guard routing system
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchPostedJobs();
  }, [token]);

  // Track the active job dropdown selector inside candidate review grid
  useEffect(() => {
    if (selectedJobId) {
      fetchApplicants(selectedJobId);
    } else {
      setApplicants([]);
    }
  }, [selectedJobId]);

  // ─── Core Connection Handlers ──────────────────────────────────────────────
  const fetchPostedJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/api/v1/jobs/my-jobs", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setPostedJobs(data.jobs);
        if (data.jobs.length > 0 && !selectedJobId) {
          setSelectedJobId(data.jobs[0]._id);
          if (data.jobs[0].company) {
            setCompanyForm(data.jobs[0].company);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicants = async (jobId) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/applications/job/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setApplicants(data.applications);
      }
    } catch (err) {
      console.error("Error loading candidates:", err);
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: jobForm.title,
        description: jobForm.description,
        location: jobForm.location,
        salary: Number(jobForm.salary),
        jobType: jobForm.jobType,
        openings: Number(jobForm.openings),
        applicationDeadline: jobForm.applicationDeadline,
        skills: jobForm.skills.split(",").map(s => s.trim()).filter(Boolean),
        eligibility: {
          minCGPA: Number(jobForm.minCGPA),
          allowedBranches: jobForm.allowedBranches.split(",").map(b => b.trim()).filter(Boolean),
          maxBacklogs: Number(jobForm.maxBacklogs)
        }
      };

      const res = await fetch("http://localhost:8000/api/v1/jobs/create", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (data.success) {
        showToast("Job opening published successfully!", "success");
        setJobForm({ 
          title: "", description: "", location: "", salary: "", jobType: "Full-Time", 
          openings: 1, applicationDeadline: "", skills: "", minCGPA: 0, allowedBranches: "", maxBacklogs: 0 
        });
        fetchPostedJobs();
        setActiveTab("jobs");
      } else {
        showToast(data.message || "Failed to post job.", "error");
        if (data.message?.toLowerCase().includes("company profile")) {
          setActiveTab("company");
        }
      }
    } catch (err) {
      console.error(err);
      showToast("An error occurred while posting the job.", "error");
    }
  };

  const handleUpdateCompany = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/api/v1/auth/recruiter/company-details", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(companyForm)
      });
      const data = await res.json();
      if (data.success || data.newCompany) {
        showToast("Company parameters registered successfully!", "success");
        fetchPostedJobs();
      } else {
        showToast(data.message || "Failed to update profile.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("An error occurred while updating profile.", "error");
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/applications/status/${applicationId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setApplicants(prev => prev.map(app => app._id === applicationId ? { ...app, status: newStatus } : app));
        showToast(`Candidate status changed to ${newStatus}`, "success");
      } else {
        showToast(data.message, "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to update status node.", "error");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans relative">
      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-5">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-900">
                <img src={target} alt="PlacementXTarget logo" className="h-7 w-7 object-contain" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">PlacementXTarget</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 mx-auto hidden sm:inline">Recruiter<span className="text-blue-900">Workspace</span></span>
          </div>
          <button type="button" onClick={handleLogout} className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>

        {/* CONTROLS TABS */}
        <div className="mx-auto flex max-w-6xl gap-2 px-6">
          {[
            { id: "jobs", label: "My Job Postings", icon: Briefcase },
            { id: "post", label: "Create Postings", icon: PlusCircle },
            { id: "applicants", label: "Review Stream", icon: Users },
            { id: "company", label: "Company Profile", icon: Building }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition ${
                activeTab === tab.id ? "border-blue-900 text-blue-900" : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              <tab.icon className="h-4 w-4" /> {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* RENDER BODY VIEWBOARDS */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        
        {/* VIEW 1: MY ACTIVE JOBS LIST */}
        {activeTab === "jobs" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Active Campus Openings</h1>
            {loading ? (
              <p className="text-sm text-slate-400">Loading tracking array data...</p>
            ) : postedJobs.length === 0 ? (
              <div className="text-center bg-white border border-dashed border-slate-200 rounded-2xl py-12">
                <Briefcase className="mx-auto h-10 w-10 text-slate-300" />
                <p className="mt-2 text-sm font-medium text-slate-500">No vacancies have been initialized yet.</p>
                <button type="button" onClick={() => setActiveTab("post")} className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-white bg-blue-900 px-4 py-2 rounded-xl">Create Job Posting</button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {postedJobs.map(job => (
                  <div key={job._id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-slate-300 transition">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-lg font-bold text-slate-900 tracking-tight">{job.title}</h3>
                        <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg whitespace-nowrap">{job.jobType}</span>
                      </div>
                      <p className="text-xs font-semibold text-blue-800 mt-1">{job.company?.CompanyName || "Setup Company Profile Required"}</p>
                      <p className="text-sm text-slate-500 mt-3 line-clamp-3 leading-relaxed">{job.description}</p>
                    </div>
                    <div className="border-t border-slate-100 pt-4 mt-5 flex items-center justify-between text-xs font-medium text-slate-400">
                      <div className="flex items-center gap-4">
                        <span>Applicants: <strong className="text-slate-800 text-sm font-bold">{job.applicantsCount || 0}</strong></span>
                        <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" /> {job.location}</span>
                      </div>
                      <span className="text-green-700 bg-green-50 px-2 py-0.5 rounded-md border border-green-100 font-bold">₹{job.salary?.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: POST NEW JOB */}
        {activeTab === "post" && (
          <div className="max-w-2xl bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Publish New Recruitment Drive</h2>
            <p className="text-xs text-slate-400 mb-6">Fill in all criteria blocks below to distribute data fields to candidate streams.</p>
            
            <form onSubmit={handlePostJob} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Job Title *</label>
                  <input required type="text" autoComplete="off" data-lpignore="true" placeholder="e.g. SDE Intern" className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:border-blue-900 mt-1" value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Job Placement Type *</label>
                  <select className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:border-blue-900 mt-1 bg-white" value={jobForm.jobType} onChange={e => setJobForm({...jobForm, jobType: e.target.value})}>
                    <option>Full-Time</option><option>Internship</option><option>Part-Time</option><option>Remote</option><option>Contract</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Location *</label>
                  <input required type="text" autoComplete="off" data-lpignore="true" placeholder="e.g. Noida, Delhi" className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:border-blue-900 mt-1" value={jobForm.location} onChange={e => setJobForm({...jobForm, location: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">CTC / Compensation (₹) *</label>
                  <input required type="number" autoComplete="off" data-lpignore="true" placeholder="Annual base salary value" className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:border-blue-900 mt-1" value={jobForm.salary} onChange={e => setJobForm({...jobForm, salary: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Total Active Openings</label>
                  <input type="number" autoComplete="off" data-lpignore="true" className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:border-blue-900 mt-1" value={jobForm.openings} onChange={e => setJobForm({...jobForm, openings: e.target.value})} />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 mt-2">
                <h3 className="text-xs font-bold uppercase text-slate-400 tracking-widest mb-3">Eligibility Matrix</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Minimum Cutoff CGPA</label>
                    <input type="number" step="0.01" autoComplete="off" data-lpignore="true" placeholder="e.g. 7.5" className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:border-blue-900 mt-1" value={jobForm.minCGPA} onChange={e => setJobForm({...jobForm, minCGPA: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Max Backlogs Allowed</label>
                    <input type="number" autoComplete="off" data-lpignore="true" className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:border-blue-900 mt-1" value={jobForm.maxBacklogs} onChange={e => setJobForm({...jobForm, maxBacklogs: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Application Deadline *</label>
                    <input required type="date" className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:border-blue-900 mt-1" value={jobForm.applicationDeadline} onChange={e => setJobForm({...jobForm, applicationDeadline: e.target.value})} />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Allowed Branches (Comma separated)</label>
                <input type="text" autoComplete="off" data-lpignore="true" placeholder="CSE, IT, ECE" className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:border-blue-900 mt-1" value={jobForm.allowedBranches} onChange={e => setJobForm({...jobForm, allowedBranches: e.target.value})} />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Skills Requirements (Comma separated) *</label>
                <input required type="text" autoComplete="off" data-lpignore="true" placeholder="React, Express, AWS, SQL" className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:border-blue-900 mt-1" value={jobForm.skills} onChange={e => setJobForm({...jobForm, skills: e.target.value})} />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Job Description *</label>
                <textarea required rows={4} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:border-blue-900 mt-1 placeholder:text-slate-300" placeholder="Specify project domains, daily operational requirements, and expectations details..." value={jobForm.description} onChange={e => setJobForm({...jobForm, description: e.target.value})} />
              </div>

              <button type="submit" className="w-full bg-blue-900 text-white font-bold py-3 rounded-xl text-sm hover:bg-blue-800 transition shadow-md mt-2">Post Job</button>
            </form>
          </div>
        )}

        {/* VIEW 3: PIPELINE REVIEW CANDIDATES AND APPLICANTS STACKS */}
        {activeTab === "applicants" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Application Screening Engine</h1>
                <p className="text-xs text-slate-400">Select active target drive positions to pull real-time student applications indices.</p>
              </div>
              <select 
                className="border border-slate-200 bg-white rounded-xl p-2.5 text-sm font-semibold outline-none max-w-xs shadow-sm focus:border-blue-900" 
                value={selectedJobId} 
                onChange={e => setSelectedJobId(e.target.value)}
              >
                <option value="">Select an active track context...</option>
                {postedJobs.map(j => <option key={j._id} value={j._id}>{j.title}</option>)}
              </select>
            </div>

            {!selectedJobId ? (
              <div className="text-center bg-white border border-slate-200 rounded-2xl py-12">
                <AlertCircle className="mx-auto h-8 w-8 text-slate-300" />
                <p className="mt-2 text-sm font-medium text-slate-400">Please select a job link from the upper right dropdown selector to access data nodes.</p>
              </div>
            ) : applicants.length === 0 ? (
              <div className="text-center bg-white border border-dashed border-slate-200 rounded-2xl py-12">
                <Users className="mx-auto h-10 w-10 text-slate-300" />
                <p className="mt-2 text-sm font-medium text-slate-500">No students have applied to this track execution point yet.</p>
              </div>
            ) : (
              <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="p-4">Student Profile</th>
                        <th className="p-4">Branch Metrics</th>
                        <th className="p-4">Resume Hook</th>
                        <th className="p-4">Current Vector</th>
                        <th className="p-4 text-center">Status Control Update</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {applicants.map(app => (
                        <tr key={app._id} className="hover:bg-slate-50/40 transition">
                          <td className="p-4">
                            <p className="font-bold text-slate-900">{app.student?.name || "Anonymous Candidate"}</p>
                            <p className="text-xs font-normal text-slate-400">{app.student?.email}</p>
                          </td>
                          <td className="p-4">
                            <p className="text-slate-700">{app.student?.branch || "General Core"}</p>
                            <p className="text-xs font-bold text-blue-900">CGPA: {app.student?.cgpa || "N/A"}</p>
                          </td>
                          <td className="p-4">
                            {app.resumeUrl || app.student?.resumeUrl ? (
                              <a href={app.resumeUrl || app.student?.resumeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-blue-900 bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg hover:bg-blue-100 transition">
                                <FileText className="h-3.5 w-3.5" /> View PDF <ExternalLink className="h-3 w-3" />
                              </a>
                            ) : (
                              <span className="text-xs text-slate-300 font-normal">No File Link Found</span>
                            )}
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLE[app.status] || STATUS_STYLE.Applied}`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center">
                              <select 
                                className="text-xs border border-slate-200 rounded-xl p-2 outline-none bg-white shadow-sm font-semibold focus:border-blue-900"
                                value={app.status}
                                onChange={e => handleStatusChange(app._id, e.target.value)}
                              >
                                {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                              </select>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 4: PROFILE MANAGEMENT REGISTRAR */}
        {activeTab === "company" && (
          <div className="max-w-xl bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Company Context Identity</h2>
            <p className="text-xs text-slate-400 mb-6">Updating details here binds references to all structural child postings profiles.</p>
            
            <form onSubmit={handleUpdateCompany} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Corporate Entity Name *</label>
                <input required type="text" autoComplete="off" data-lpignore="true" className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:border-blue-900 mt-1" value={companyForm.CompanyName} onChange={e => setCompanyForm({...companyForm, CompanyName: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Public Communications Email *</label>
                  <input required type="email" autoComplete="off" data-lpignore="true" className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:border-blue-900 mt-1" value={companyForm.CompanyEmail} onChange={e => setCompanyForm({...companyForm, CompanyEmail: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Web Address Domain *</label>
                  <input required type="url" autoComplete="off" data-lpignore="true" placeholder="https://example.com" className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:border-blue-900 mt-1" value={companyForm.companyWebsite} onChange={e => setCompanyForm({...companyForm, companyWebsite: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Industry Verticals Sector *</label>
                <input required type="text" autoComplete="off" data-lpignore="true" placeholder="e.g. Technology, Finance, Analytics" className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:border-blue-900 mt-1" value={companyForm.industry} onChange={e => setCompanyForm({...companyForm, industry: e.target.value})} />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Operational Overview Brief *</label>
                <textarea required rows={4} maxLength={1000} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:border-blue-900 mt-1" placeholder="Describe core competencies, corporate mission, and workspace parameters details..." value={companyForm.description} onChange={e => setCompanyForm({...companyForm, description: e.target.value})} />
              </div>

              <button type="submit" className="w-full bg-blue-900 text-white font-bold py-3 rounded-xl text-sm hover:bg-blue-800 transition shadow-md mt-2">Update Company Profile</button>
            </form>
          </div>
        )}

      </main>

      {/* ─── TOASTER BOTTOM RIGHT BANNER CONTAINER ─── */}
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
          <button type="button" onClick={() => setToast(null)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-50">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}