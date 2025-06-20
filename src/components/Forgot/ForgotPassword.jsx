"use client";
import React, { useState } from "react";
import EmailStep from "./EmailStep";
import VerificationStep from "./VerificationStep";
import NewPasswordStep from "./NewPasswordStep";
import ErrorMessage from "./ErrorMessage";
import axios from "axios";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Validate email and send OTP
  const validateAndSendOTP = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setError("Vui lòng nhập địa chỉ email hợp lệ");
      return;
    }
    
    setError("");
    setIsLoading(true);
    
    try {
      const response = await axios.post(
        "https://backend-docker-production-c584.up.railway.app/api/auth/send-reset-otp",
        { email },
        { withCredentials: true }
      );
      
      setSuccessMsg("Mã xác thực đã được gửi đến email của bạn");
      setStep(2);
    } catch (err) {
      console.error("Error sending OTP:", err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Có lỗi xảy ra khi gửi mã xác thực, vui lòng thử lại sau");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Validate the verification code
  const validateCode = () => {
    if (!code || code.length !== 6) {
      setError("Vui lòng nhập mã xác thực hợp lệ");
      return;
    }
    setError("");
    setStep(3);
  };

  // Resend OTP function
  const resendOTP = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://backend-docker-production-c584.up.railway.app/api/auth/send-reset-otp",
        { email },
        { withCredentials: true }
      );
      setSuccessMsg("Mã xác thực mới đã được gửi đến email của bạn");
      setError("");
    } catch (err) {
      console.error("Error resending OTP:", err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Có lỗi xảy ra khi gửi lại mã xác thực");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Handle submission of new password
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
      // Send email, code and new password to the backend
      const response = await axios.post(
        "https://backend-docker-production-c584.up.railway.app/api/auth/reset-password",
        { emailOrPhone: email, code, newPassword },
        { withCredentials: true }
      );
      setSuccessMsg(response.data.message);
      // Reset the flow after success
      setTimeout(() => {
        setStep(1);
        setEmail("");
        setCode("");
        setNewPassword("");
        setConfirmPassword("");
        setSuccessMsg("");
      }, 3000);
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
        <EmailStep 
          email={email} 
          setEmail={setEmail} 
          onSubmit={validateAndSendOTP}
          isLoading={isLoading}
        />
      )}

      {step === 2 && (
        <VerificationStep
          code={code}
          setCode={setCode}
          onBack={() => setStep(1)}
          onSubmit={validateCode}
          onResend={resendOTP}
          isLoading={isLoading}
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