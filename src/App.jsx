import Homepage from "./components/Homepage/Homepage.jsx";
import React from "react";
import ReactDOM from "react-dom/client";

import './App.css';
import { Routes, Route, Navigate } from "react-router-dom";
import SplashScreen from "./components/SplashScreen";
import SignUp from "./components/SignUp/SignUp.jsx";
import Login from "./components/Login/Login.jsx";
import Introduction from "./components/Introduction/Introduction.jsx";
import NumerologyCalculator from "./components/Numerology/NumerologyCalculator.jsx";
import AstrologyCalculator from "./components/Astrology/AstrologyCalculator.jsx";
import AstroAdminDashboard from "./ADMIN/DashboardUser/AstroAdminDashboard.jsx";
import NumerologyDashboard from "./ADMIN/DashboardNumero/NumerologyDashboard.jsx";
import AstrologyDashboard from "./ADMIN/DashboardAstro/AstrologyDashboard.jsx";
import ReadingDashboard from "./ADMIN/DashboardReading/ReadingDashboard.jsx";
import HuongDan from "./components/Guide/HuongDan.jsx";
import NumerologyResult from "./components/Numerology/NumerologyResult.jsx";
import AstrologyResult from "./components/Astrology/AstrologyResult.jsx";


function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/loading" element={<SplashScreen />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/introduction" element={<Introduction />} />
        <Route path="/numerology" element={<NumerologyCalculator />} />
        <Route path="/astrology" element={<AstrologyCalculator />} />
        <Route path="/admin" element={<AstroAdminDashboard />} />
        <Route path="/admin-numerology" element={<NumerologyDashboard />} />
        <Route path="/admin-astrology" element={<AstrologyDashboard />} />
        <Route path="/admin-reading" element={<ReadingDashboard />} />
        <Route path="/guide" element={<HuongDan />} />
        <Route path="/numerology/result" element={<NumerologyResult />} />
        <Route path="/astrology/result" element={<AstrologyResult />} />

      </Routes>
    </div>
  );
}

export default App;
