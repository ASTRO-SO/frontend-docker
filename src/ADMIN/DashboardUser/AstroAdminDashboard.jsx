"use client";
import Sidebar from "../layout/Sidebar";
import Header from "../layout/Header";
import StatsCard from "./StatsCard";
import ActivityTable from "./ActivityTable";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

function AstroAdminDashboard() {
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
  // Remove hardcoded stats and make it dynamic
  const [userCount, setUserCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin and redirect if needed
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "admin") {
      navigate("/");
      return;
    }
  }, [navigate]);

  // Function to update user count from ActivityTable
  const handleUserCountUpdate = (count) => {
    setUserCount(count);
  };

  return (
    <div className="flex w-screen h-screen bg-gray-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex flex-col flex-1">
        <Header activeTab={activeTab} notifications={notifications} />

        <section className="overflow-y-auto flex-1 p-6 bg-gray-900">
          <div className="grid grid-cols-3 gap-6 mb-6">
            <StatsCard title="Total Users" value={userCount} />
          </div>

          <ActivityTable onUserCountUpdate={handleUserCountUpdate} />
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

export default AstroAdminDashboard;