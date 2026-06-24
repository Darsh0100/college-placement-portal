import React from "react";
import { CIcon } from "@coreui/icons-react";
import { cibLinkedin, cibTwitter } from "@coreui/icons";
import target from "../assets/target.png";

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-900">
            <img src={target} alt="PlacementXTarget logo" className="h-6 w-6" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">PlacementXTarget</span>
        </div>

        <p className="max-w-sm text-sm text-slate-500">
          A unified platform connecting students and recruiters to make campus placements simple.
        </p>

        <div className="flex items-center gap-3 select-none">
        <a  
            href="#"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:border-blue-200 hover:text-blue-700"
          >
            <CIcon icon={cibLinkedin} className="h-4 w-4" />
          </a>
        <a  
            href="#"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:border-blue-200 hover:text-blue-700"
          >
            <CIcon icon={cibTwitter} className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-6xl items-center justify-center border-t border-slate-100 py-6 text-xs text-slate-400">
        <p>© 2026 PlacementXTarget. All rights reserved.</p>
      </div>
    </footer>
  );
}