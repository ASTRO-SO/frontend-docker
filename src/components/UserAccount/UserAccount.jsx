"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import FormField from "./FormField";
import ActionButtons from "./ActionButtons";

const UserAccount = ({ onChangePassword }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({
    fullname: "",
    email: "",
    phone: "",
  });

  // Create apiClient with interceptors
  const apiClient = axios.create({
    baseURL: "https://backend-docker-production-c584.up.railway.app/api",
    withCredentials: true, // For cookies
  });

  // Add request interceptor to include token in headers if available
  apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Add response interceptor to handle auth errors
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Clear auth data and redirect to login
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        window.location.href = "/";
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("Fetching user profile...");
        const response = await apiClient.get("/auth/profile");
        console.log("Profile response:", response.data);
        
        setUserData({
          fullname: response.data.fullname || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
        });
        setError(null);
      } catch (err) {
        console.error("Error fetching profile:", err);
        console.error("Error response:", err.response?.data);
        setError(err.response?.data?.error || "Error fetching user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      console.log("Updating profile with data:", userData);
      
      const response = await apiClient.put("/auth/profile", {
        fullname: userData.fullname,
        email: userData.email,
        phone: userData.phone,
      });
      
      console.log("Update response:", response.data);
      setIsEditing(false);
      setError(null);
      
      // Update userData with the response if the backend returns updated data
      if (response.data.user) {
        setUserData({
          fullname: response.data.user.fullname || "",
          email: response.data.user.email || "",
          phone: response.data.user.phone || "",
        });
      }
      
      alert("Profile updated successfully!");
      
    } catch (err) {
      console.error("Error updating profile:", err);
      console.error("Error response:", err.response?.data);
      setError(err.response?.data?.error || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field) => (value) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogout = async () => {
    try {
      // Try to call logout endpoint
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Logout API error:", error);
      // Continue with logout even if API call fails
    } finally {
      // Clear local storage and redirect
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      window.location.href = "/";
    }
  };

  if (loading) {
    return (
      <section className="bg-[#FFF] rounded-[8px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] p-[32px]">
        <p className="text-center">Loading user data...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-[#FFF] rounded-[8px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] p-[32px]">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-[24px] py-[12px] bg-[#872472] text-[#FFF] rounded-[4px] font-semibold cursor-pointer"
          >
            Retry
          </button>
        </div>
      </section>
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

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

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
          isEditing={false} // Phone should not be editable
          onChange={handleFieldChange("phone")}
        />

        {isEditing && (
          <div className="flex justify-end gap-[16px] mt-[16px]">
            <button
              onClick={() => {
                setIsEditing(false);
                setError(null);
              }}
              className="px-[24px] py-[12px] bg-[#F5F5F5] text-[#242108] rounded-[4px] cursor-pointer font-semibold"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-[24px] cursor-pointer py-[12px] bg-[#CCA508] text-[#FFF] rounded-[4px] font-semibold disabled:opacity-50"
            >
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        )}
      </div>

      <ActionButtons onChangePassword={onChangePassword} onLogout={handleLogout} />
    </section>
  );
};

export default UserAccount;