"use client";
import React, { useState } from "react";
import axios from "axios";
import FormInput from "./FormInput";
import ErrorMessage from "./ErrorMessage";

const PasswordChange = ({ onBack }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (newPassword.length < 8) {
      setError("Mật khẩu mới phải có ít nhất 8 ký tự");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    setError("");

    try {
      const response = await axios.put(
        "https://backend-docker-production-c584.up.railway.app/api/auth/change-password",
        { currentPassword, newPassword },
        { withCredentials: true }
      );
      console.log("Password changed successfully:", response.data.message);
      // Optionally, display a success notification here.
      onBack(); // Return to the account page/modal
    } catch (err) {
      console.error("Error changing password:", err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Có lỗi xảy ra, vui lòng thử lại sau");
      }
    }
  };

  return (
    <div className="bg-[#FFF] rounded-[8px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] p-[32px]">
      <header className="flex items-center gap-[12px] mb-[32px]">
        <img src="/AstroIcon.png" alt="Lock icon" className="h-[32px]" />
        <h1 className="text-[24px] font-semibold">Đổi Mật Khẩu</h1>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-[24px]">
        <FormInput
          label="Mật khẩu hiện tại"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Nhập mật khẩu hiện tại"
        />

        <FormInput
          label="Mật khẩu mới"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Nhập mật khẩu mới"
          helpText="Mật khẩu phải có ít nhất 8 ký tự"
        />

        <FormInput
          label="Xác nhận mật khẩu mới"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Xác nhận mật khẩu mới"
        />

        <ErrorMessage error={error} />

        <div className="flex gap-[16px] mt-[16px]">
          <button
            type="button"
            onClick={onBack}
            className="px-[24px] py-[12px] bg-[#F5F5F5] text-[#242108] rounded-[4px] font-semibold"
          >
            Quay lại
          </button>
          <button
            type="submit"
            className="px-[24px] py-[12px] bg-[#CCA508] text-[#FFF] rounded-[4px] font-semibold"
          >
            Đổi mật khẩu
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordChange;