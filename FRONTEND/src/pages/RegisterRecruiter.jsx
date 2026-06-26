import React, { useState } from "react";
import { Building2, Mail, Globe, Image, Briefcase, AlignLeft, Calendar, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import target from "../assets/target.png";

const industries = [
  "Software & Technology",
  "Banking & Finance",
  "Healthcare",
  "Education",
  "E-Commerce",
  "Manufacturing",
  "Consulting",
  "Media & Entertainment",
  "Telecommunications",
  "Government & Public Sector",
  "Other",
];

export default function RegisterRecruiter() {
  const navigate = useNavigate();
  const [role, setRole] = useState("recruiter");
  const [form, setForm] = useState({
    CompanyName: "",
    CompanyEmail: "",
    RecruiterEmail:"",
    password: "", // Added
    companyWebsite: "",
    companyLogo: "",
    industry: "",
    description: "",
    foundedYear: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSubmit() {
// Inside your handleSubmit function within RegisterRecruiter.jsx
setLoading(true);
const res = await fetch("https://college-placement-portal-y3bt.onrender.com/api/v1/auth/register/recruiter", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...form,
      role: "recruiter", // Ensure backend reads recruiter conditions safely
      foundedYear: form.foundedYear ? Number(form.foundedYear) : undefined,
    }),
  });
  const data = await res.json();
  if (!res.ok) { setError(data.message || "Failed to register company."); return; }
  
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  navigate("/recruiter/dashboard");
setLoading(false);}

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-lg">

        {/* Back */}
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-900"
        >
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>

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
          <h2 className="mt-6 text-3xl font-bold text-slate-900">Register your company</h2>
          <p className="mt-1 text-sm text-slate-500">
            Tell us about your company so students can find and apply to your openings.
          </p>
          {/* Role Toggle */}
          <div className="mt-5 grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => {setRole("recruiter");
                navigate("/register");
              }}
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





          <div className="mt-6 space-y-4">

            {/* Company Name */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Company name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={form.CompanyName}
                  onChange={(e) => update("CompanyName", e.target.value)}
                  placeholder="Acme Corp"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Company Email */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Company email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={form.CompanyEmail}
                  onChange={(e) => update("CompanyEmail", e.target.value)}
                  placeholder="hr@acmecorp.com"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/*recruiter email*/}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Recruiter email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={form.RecruiterEmail}
                  onChange={(e) => update("RecruiterEmail", e.target.value)}
                  placeholder="recruiter@gmail.com"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>


            {/*company password*/}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
               Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Website */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Company website <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  value={form.companyWebsite}
                  onChange={(e) => update("companyWebsite", e.target.value)}
                  placeholder="https://acmecorp.com"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Company Logo URL (Cloudinary) */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Company logo URL <span className="text-slate-400 font-normal">(optional — Cloudinary link)</span>
              </label>
              <div className="relative">
                <Image className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  value={form.companyLogo}
                  onChange={(e) => update("companyLogo", e.target.value)}
                  placeholder="https://res.cloudinary.com/..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Industry */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Industry <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Briefcase className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <select
                  value={form.industry}
                  onChange={(e) => update("industry", e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select industry</option>
                  {industries.map((i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Founded Year */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Founded year <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  min="1800"
                  max={new Date().getFullYear()}
                  value={form.foundedYear}
                  onChange={(e) => update("foundedYear", e.target.value)}
                  placeholder="2010"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Description <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <AlignLeft className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <textarea
                  rows={4}
                  maxLength={1000}
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="Tell students what your company does, your culture, and what makes you unique..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 resize-none"
                />
                <p className="mt-1 text-right text-xs text-slate-400">{form.description.length}/1000</p>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            )}

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full rounded-xl bg-blue-900 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 active:bg-blue-950 disabled:opacity-60"
            >
              {loading ? "Registering..." : "Register company"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}