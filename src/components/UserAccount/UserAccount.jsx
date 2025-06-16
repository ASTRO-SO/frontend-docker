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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("https://backend-docker-production-c584.up.railway.app/api/auth/profile", {
          withCredentials: true,
        });
        setUserData({
          fullname: response.data.fullname,
          email: response.data.email,
          phone: response.data.phone,
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Error fetching user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    try {
      // Send the updated user data to your API
      await axios.put("https://backend-docker-production-c584.up.railway.app/api/auth/profile", userData, {
        withCredentials: true,
      });
      setIsEditing(false);
      // Optionally, you could refresh the user data after a successful update.
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const handleFieldChange = (field) => (value) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogout = () => {
    // Implement logout logic — e.g. call your logout API endpoint and remove session tokens from storage.
    axios
      .post("https://backend-docker-production-c584.up.railway.app/api/auth/logout", {}, { withCredentials: true })
      .then(() => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("token");
        window.location.href = "/";
        console.log("Logout successful");
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  if (loading) {
    return <p>Loading user data...</p>;
  }

  if (error) {
    return <p>{error}</p>;
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
          isEditing={isEditing}
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

      <ActionButtons onChangePassword={onChangePassword} />
    </section>
  );
};

export default UserAccount;