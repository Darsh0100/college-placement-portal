import React, { useState } from "react";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import target from "../assets/target.png"
import { Button, Spinner } from "flowbite-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading,setLoading]=useState("");
  const navigate = useNavigate();

  async function handleLogin() {
    // 1. Validate inputs BEFORE changing loading UI states
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }
  
    try {
      setLoading(true); 
      
      const response = await fetch(
        "https://college-placement-portal-y3bt.onrender.com/api/v1/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
  
      // ... rest of your login logic stays exactly the same ...
  
      const data = await response.json();
  
      if (!data.success) {
        alert(data.message);
        return;
      }
  
      localStorage.setItem("token", data.token);
  
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );
  
    //   alert(data.message);
  
      if (data.user.role === "student") {
        navigate("/student/dashboard");
      }
  
      else if (data.user.role === "recruiter") {
        navigate("/recruiter/dashboard");
      }
  
      else if (data.user.role === "admin") {
        navigate("/admin-dashboard");
      }
  
    } catch (error) {
  
      console.error(error);
  
      alert("Unable to login");
  
    }
    finally{
    setLoading(false);}
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
    {loading?<Button>
        <Spinner aria-label="Spinner button example" size="sm" light />
        <span className="pl-3">Loading...</span>
      </Button> :
      <div className="w-full max-w-md">

        {/* Back to home */}
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
          <h2 className="mt-6 text-3xl font-bold text-slate-900">Welcome back</h2>
          <p className="mt-1 text-sm text-slate-500">Log in to continue to your dashboard.</p>

          {/* Fields */}
          <div className="mt-6 space-y-4">

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="button"
              onClick={handleLogin}
              className="w-full rounded-xl bg-blue-900 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 active:bg-blue-950"
            >
              Log in
            </button>
          </div>

          {/* Sign up link */}
          <p className="mt-5 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-blue-700 hover:underline">
              Sign up
            </Link>
          </p>

        </div>
      </div>}
    </div>
  );
}