import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Layout from "../components/Layout";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import StudentDashboard from "../pages/StudentDashboard";
import RecruiterDashboard from "../pages/RecruiterDashboard";
import RegisterRecruiter from "../pages/RegisterRecruiter";

function AppRoutes() {

  return (
    <BrowserRouter>

      <Routes>

        {/* Public Pages */}

        <Route  element={<Layout />}>

          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/register/recruiter" element={<RegisterRecruiter/>} />

        </Route>

        {/* Student */}

        <Route
          path="/student/dashboard"
          element={<StudentDashboard />}
        />

        {/* Recruiter */}

        <Route
          path="/recruiter/dashboard"
          element={<RecruiterDashboard />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default AppRoutes;