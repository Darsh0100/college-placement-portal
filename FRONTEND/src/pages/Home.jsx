import React from "react";
import { UserPlus, Send, CheckCircle2 } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";



function Home(){
    const navigate=useNavigate();
    return  <section className="min-h-screen bg-white flex flex-col items-center justify-start px-4 pt-18 pb-12 text-center select-none">
    <div className="max-w-4xl mx-auto flex flex-col items-center gap-6 sm:gap-8">
      
      {/* Top Pill Badge */}
      <div className="w-fit inline-flex items-center justify-center px-5 py-1.5 rounded-full border border-blue-200 bg-blue-50/50">
        <span className="text-blue-600 font-medium tracking-wide text-xs sm:text-sm">
          Built for college placement cells
        </span>
      </div>

      {/* Main Heading */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
        Empowering Careers Through <br className="hidden sm:inline" />
        <span className="text-blue-600 italic font-black block sm:inline mt-2 sm:mt-0">
          Seamless Placement
        </span>
      </h1>

      {/* Subheading / Description */}
      <p className="max-w-2xl text-slate-500 font-normal text-base sm:text-lg md:text-xl leading-relaxed mt-2">
        One platform for students to discover and apply to jobs, and for recruiters to post roles, review applicants, and schedule interviews — without the spreadsheet chaos.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mt-4">
        {/* Primary CTA - Student Registration */}
        <button onClick={()=>navigate("/register")} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0b2a58ea] hover:bg-slate-800 text-white font-medium px-6 py-3 rounded-lg transition-colors text-sm sm:text-base shadow-sm">
          Student Registration
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Secondary CTA - Company Portal */}
        <button onClick={()=>navigate("/register/recruiter")} className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 text-[#1d3557] font-medium px-8 py-3 rounded-lg border border-slate-200 transition-colors text-sm sm:text-base shadow-sm">
          Company Registration
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>



      <div className="container bg-slate-50 min-w-screen min-h-fit px-6 py-16">
  <div className="font-bold tracking-wider text-4xl text-center text-slate-900">How It Works</div>
  <div className="flex flex-col flex-wrap mx-auto gap-4 my-4 min-w-fit ">
    <div className="rounded-2xl border border-slate-200 bg-white p-8 flex flex-col  items-start">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
          <UserPlus className="h-5 w-5 text-blue-900" />
        </div>
        <span className="text-sm font-bold tracking-widest text-slate-400">STEP 1</span>
      </div>
      <h3 className="mt-5 text-2xl font-bold text-slate-900">Create your profile</h3>
      <p className="mt-3 text-base leading-relaxed text-slate-500">
        Students build a profile and upload a resume. Recruiters register their company in minutes.
      </p>
    </div>

    <div className="rounded-2xl border border-slate-200 bg-white p-8 flex flex-col  items-start">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
          <Send className="h-5 w-5 text-blue-900" />
        </div>
        <span className="text-sm font-bold tracking-widest text-slate-400">STEP 2</span>
      </div>
      <h3 className="mt-5 text-2xl font-bold text-slate-900">Apply or post openings</h3>
      <p className="mt-3 text-base leading-relaxed text-slate-500">
        Students browse and apply to roles. Recruiters publish job postings for the whole campus to see.
      </p>
    </div>

    <div className="rounded-2xl border border-slate-200 bg-white p-8 flex flex-col  items-start">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
          <CheckCircle2 className="h-5 w-5 text-blue-900" />
        </div>
        <span className="text-sm font-bold tracking-widest text-slate-400">STEP 3</span>
      </div>
      <h3 className="mt-5 text-2xl font-bold text-slate-900">Get matched & hired</h3>
      <p className="mt-3 text-base leading-relaxed text-slate-500">
        Recruiters review, shortlist, and schedule interviews — all tracked in one place, end to end.
      </p>
    </div>
  </div>
</div>

    </div>
  </section>
}

export default Home;