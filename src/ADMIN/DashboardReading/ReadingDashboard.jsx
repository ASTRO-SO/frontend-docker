"use client";
import Sidebar from "../layout/Sidebar";
import Header from "../layout/Header";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import ReadingManagement from "./ReadingManagement";
import SplashScreen from "../../components/SplashScreen"

function ReadingDashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const [showSidebar, setShowSidebar] = useState(true);
  const [notifications, setNotifications] = useState([
    {
      text: "New user registration",
      time: "2m ago",
    },
    {
      text: "System update completed",
      time: "1h ago",
    },
  ]);

const navigate = useNavigate();
const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin and redirect if needed
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "admin") {
      navigate("/");
      return;
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

    if (loading) {
    return <SplashScreen />;
  }

  return (
    <div className="flex w-screen min-h-screen bg-gray-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex flex-col flex-1">
        <Header activeTab={activeTab} notifications={notifications} />

        <section className="flex-1 p-6 bg-gray-900">
          <ReadingManagement/>
        </section>
      </main>

      <div>
        <div
          dangerouslySetInnerHTML={{
            __html:
              '<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">',
          }}
        />
      </div>
    </div>
  );
}

export default ReadingDashboard;
