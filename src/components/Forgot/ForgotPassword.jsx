"use client";
import React, { useState } from "react";
import PhoneStep from "./PhoneStep";
import VerificationStep from "./VerificationStep";
import NewPasswordStep from "./NewPasswordStep";
import ErrorMessage from "./ErrorMessage";
import axios from "axios";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Step 1: Validate the phone. (Assumes valid phone is exactly 10 digits)
  const validatePhone = () => {
    if (!phone || !/^[0-9]{10}$/.test(phone)) {
      setError("Vui lòng nhập số điện thoại hợp lệ");
      return;
    }
    setError("");
    // In a real-world scenario you might also trigger sending a verification code via SMS here.
    setStep(2);
    // For testing purposes we hardcode the expected verification code.
    setCode("131313");
  };

  // Step 2: Validate the verification code.
  const validateCode = () => {
    if (!code || code.length !== 6) {
      setError("Vui lòng nhập mã xác thực hợp lệ");
      return;
    }
    setError("");
    setStep(3);
  };

  // Step 3: Handle submission of new password.
  const handleSubmit = async () => {
    if (!newPassword || newPassword.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }
    setError("");

    try {
      // Sends phone, code and new password to the backend to update the user's password in the database.
      const response = await axios.post(
        "backend-docker-production-c584.up.railway.app/api/auth/reset-password",
        { phone, code, newPassword },
        { withCredentials: true }
      );
      setSuccessMsg(response.data.message);
      // You might want to redirect or reset the flow after success.
      setStep(1);
    } catch (err) {
      console.error("Error resetting password:", err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Có lỗi xảy ra, vui lòng thử lại sau");
      }
    }
  };

  return (
    <section className="bg-[#FFF] rounded-[8px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] p-[32px]">
      <header className="flex items-center gap-[12px] mb-[32px]">
        <img
          src="/AstroIcon.png"
          alt="Lock icon"
          className="h-[32px]"
        />
        <h1 className="text-[24px] text-black font-semibold">Quên mật khẩu</h1>
      </header>

      {step === 1 && (
        <PhoneStep phone={phone} setPhone={setPhone} onSubmit={validatePhone} />
      )}

      {step === 2 && (
        <VerificationStep
          code={code}
          setCode={setCode}
          onBack={() => setStep(1)}
          onSubmit={validateCode}
        />
      )}

      {step === 3 && (
        <NewPasswordStep
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          onBack={() => setStep(2)}
          onSubmit={handleSubmit}
        />
      )}

      {error && <ErrorMessage message={error} />}
      {successMsg && <p className="text-green-500 mt-4">{successMsg}</p>}
    </section>
  );
};

export default ForgotPassword;