"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import FormField from "./FormField";
import ActionButtons from "./ActionButtons";

const UserAccount = ({ onChangePassword }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState({
    fullname: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // First, you need to get the current user's ID
        // This could come from localStorage, a token, or another endpoint
        const storedUserId = localStorage.getItem("userId");
        
        if (!storedUserId) {
          throw new Error("User ID not found. Please log in again.");
        }

        setUserId(storedUserId);

        // Use the existing backend route to get user by ID
        const response = await axios.get(
          `https://backend-docker-production-c584.up.railway.app/api/users/${storedUserId}`,
          {
            withCredentials: true,
          }
        );
        
        setUserData({
          fullname: response.data.fullname,
          email: response.data.email || "",
          phone: response.data.phone,
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.response?.data?.error || "Error fetching user data");
        
        // If error is 404 or authentication related, redirect to login
        if (err.response?.status === 404 || err.response?.status === 401) {
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          window.location.href = "/";
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    try {
      if (!userId) {
        throw new Error("User ID not found");
      }

      // Use the existing PUT route to update user
      await axios.put(
        `https://backend-docker-production-c584.up.railway.app/api/users/${userId}`,
        {
          phone: userData.phone,
          fullname: userData.fullname,
          email: userData.email,
        },
        {
          withCredentials: true,
        }
      );
      
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert(err.response?.data?.error || "Error updating profile");
    }
  };

  const handleFieldChange = (field) => (value) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogout = () => {
    // Clear all stored data
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    
    // You might want to call a logout endpoint if it exists
    axios
      .post(
        "https://backend-docker-production-c584.up.railway.app/api/auth/logout",
        {},
        { withCredentials: true }
      )
      .then(() => {
        window.location.href = "/";
        console.log("Logout successful");
      })
      .catch((error) => {
        console.error("Logout error:", error);
        // Still redirect even if logout endpoint fails
        window.location.href = "/";
      });
  };

  if (loading) {
    return <p>Loading user data...</p>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
        <button 
          onClick={() => window.location.href = "/login"}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <section className="bg-[#FFF] rounded-[8px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] p-[32px]">
      <header className="flex justify-between gap-5 items-center mb-[32px]">
        <h1 className="text-[24px] font-semibold">Thông tin cá nhân</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-[24px] py-[12px] bg-[#872472] text-[#FFF] rounded-[4px] font-semibold cursor-pointer"
          >
            Chỉnh sửa
          </button>
        )}
      </header>

      <div className="flex flex-col gap-[24px]">
        <FormField
          label="Họ và tên"
          value={userData.fullname}
          type="text"
          placeholder="Nhập họ và tên"
          isEditing={isEditing}
          onChange={handleFieldChange("fullname")}
        />

        <FormField
          label="Email"
          value={userData.email}
          type="email"
          placeholder="Nhập email"
          isEditing={isEditing}
          onChange={handleFieldChange("email")}
        />

        <FormField
          label="Số điện thoại"
          value={userData.phone}
          type="tel"
          placeholder="Nhập số điện thoại"
          isEditing={false} // Keep phone readonly as in original
          onChange={handleFieldChange("phone")}
        />

        {isEditing && (
          <div className="flex justify-end gap-[16px] mt-[16px]">
            <button
              onClick={() => setIsEditing(false)}
              className="px-[24px] py-[12px] bg-[#F5F5F5] text-[#242108] rounded-[4px] cursor-pointer font-semibold"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="px-[24px] cursor-pointer py-[12px] bg-[#CCA508] text-[#FFF] rounded-[4px] font-semibold"
            >
              Lưu thay đổi
            </button>
          </div>
        )}
      </div>

      <ActionButtons onChangePassword={onChangePassword} handleLogout={handleLogout} />
    </section>
  );
};

export default UserAccount;