import React, { useState } from "react";
import { Mail, Lock, ArrowLeft, User, BookOpen, Star, Link, Plus, X } from "lucide-react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import target from "../assets/target.png";
import { Button, Spinner } from "flowbite-react";


export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [skillInput, setSkillInput] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    branch: "",
    cgpa: "",
    skills: [],
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function addSkill() {
    const s = skillInput.trim();
    if (s && !form.skills.includes(s)) {
      update("skills", [...form.skills, s]);
    }
    setSkillInput("");
  }

  function removeSkill(skill) {
    update("skills", form.skills.filter((s) => s !== skill));
  }

  async function handleRegister() {
    setError("");
    
    // 1. Validation check
    if (!form.name || !form.email || !form.password || !form.branch || !form.cgpa) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      // NOTE: Adjust the path below to match your backend mount structure exactly 
      // (e.g., http://localhost:8000/api/v1/register if using version prefixes)
      const res = await fetch("http://localhost:8000/api/v1/auth/register", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role, cgpa: Number(form.cgpa) }),
      });

      // 2. Safe error check before running JSON transformation rules
      if (!res.ok) {
        let errorMsg = "Registration failed.";
        try {
          const errorData = await res.json();
          errorMsg = errorData.message || errorMsg;
        } catch (parseResponseError) {
          // Handles cases where the server sends plain text / standard HTML 404 errors
          errorMsg = `Server error code: ${res.status}`;
        }
        setError(errorMsg);
        return;
      }

      const data = await res.json();
      
      if (data.success || data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/student/dashboard");
      } else {
        setError(data.message || "An unhandled execution error occurred.");
      }

    } catch (err) {
      console.error("Fetch Exception Error Log:", err);
      setError("Network error: Could not reach the registration server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
        {loading?<Button>
        <Spinner aria-label="Spinner button example" size="sm" light />
        <span className="pl-3">Loading...</span>
      </Button> :



      <div className="w-full max-w-lg">

        {/* Back to home */}
        <RouterLink
          to="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-900"
        >
          <ArrowLeft className="h-4 w-4" /> Back to home
        </RouterLink>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-900">
              <img src={target} alt="logo" className="h-7 w-7" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">PlacementXTarget</span>
          </div>

          {/* Heading */}
          <h2 className="mt-6 text-3xl font-bold text-slate-900">Create your account</h2>
          <p className="mt-1 text-sm text-slate-500">Fill in the details below to get started.</p>

          {/* Role Toggle */}
          <div className="mt-5 grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`rounded-md py-2 text-sm font-semibold transition ${
                role === "student" ? "bg-white text-blue-900 shadow-sm" : "text-slate-500"
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => {
                setRole("recruiter");
                navigate("/register/recruiter");
              }}
              className={`rounded-md py-2 text-sm font-semibold transition ${
                role === "recruiter" ? "bg-white text-blue-900 shadow-sm" : "text-slate-500"
              }`}
            >
              Recruiter
            </button>
          </div>

          {/* Fields */}
          <div className="mt-6 space-y-4">

            {/* Name */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Full name<span className="text-red-500">*</span></label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Email<span className="text-red-500">*</span></label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Password<span className="text-red-500">*</span></label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
            <div>
  <label className="mb-1.5 block text-sm font-medium text-slate-700">
    Branch<span className="text-red-500">*</span>
  </label>
  <div className="relative">
    <select
      value={form.branch}
      onChange={(e) => update("branch", e.target.value)}
      className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
    >
      <option value="" disabled hidden>Select Branch</option>
      <option value="CSE">CSE</option>
      <option value="IT">IT</option>
      <option value="CSE-AIML">CSE-AIML</option>
      <option value="CSE-DS">CSE-DS</option>
      <option value="ECE">ECE</option>
      <option value="EE">EE</option>
      <option value="ME">ME</option>
      <option value="CE">CE</option>
    </select>

    {/* Left Icon */}
    <BookOpen className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

    {/* Custom Dropdown Chevron Arrow on the Right */}
    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
</div>

            {/* CGPA */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">CGPA (0 – 10)<span className="text-red-500">*</span></label>
              <div className="relative">
                <Star className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.01"
                  value={form.cgpa}
                  onChange={(e) => update("cgpa", e.target.value)}
                  placeholder="8.5"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
            {/* Skills */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Skills <span className="text-slate-400 font-normal">(optional)</span></label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addSkill()}
                  placeholder="e.g. React, Node.js"
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-900 text-white hover:bg-blue-800"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {form.skills.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                    >
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            )}

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleRegister}
              disabled={loading}
              className="w-full rounded-xl bg-blue-900 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 active:bg-blue-950 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </div>

          {/* Login link */}
          <p className="mt-5 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <RouterLink to="/login" className="font-semibold text-blue-700 hover:underline">
              Log in
            </RouterLink>
          </p>

        </div>
      </div>}
    </div>
);
}