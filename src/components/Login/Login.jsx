"use client";

import React, { useState } from "react";
import axios from "axios";
import LoginHeader from "./LoginHeader";
import PhoneInput from "./PhoneInput";
import PasswordInput from "./PasswordInput";
import RememberForgot from "./RememberForgot";
import LoginButton from "./LoginButton";
import RegisterPrompt from "./RegisterPrompt";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthProvider";

const Login = () => {
  const [emailOrPhone, setEmailOrPhone] = useState(""); // Changed from phone to emailOrPhone
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [errors, setErrors] = useState({
    emailOrPhone: "",
    password: "",
    server: ""
  });

  const validate = () => {
    const newErrors = {
      emailOrPhone: emailOrPhone.length < 3 ? "Email or phone number is required" : "",
      password: password.length < 8 ? "Password must be at least 8 characters" : "",
    };
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return !newErrors.emailOrPhone && !newErrors.password;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors((prev) => ({ ...prev, server: "" }));
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      console.log("Attempting login with:", { emailOrPhone });
      
      const response = await axios.post(
        "https://backend-docker-production-c584.up.railway.app/api/auth/login",
        { emailOrPhone, password }, // Send emailOrPhone instead of phone
        { withCredentials: true }
      );

      console.log("Login response:", response.data);
      
      console.log("Response structure:", {
        hasToken: !!response.data.token,
        hasAccessToken: !!response.data.accessToken,
        responseKeys: Object.keys(response.data),
        fullResponseData: response.data
      });

      // Extract token with more fallbacks
      let token = null;
      if (response.data.token) {
        token = response.data.token;
      } else if (response.data.accessToken) {
        token = response.data.accessToken;
      } else if (response.data.data && response.data.data.token) {
        token = response.data.data.token;
      } else if (response.data.data && response.data.data.accessToken) {
        token = response.data.data.accessToken;
      }
      
      // Extract userRole with more fallbacks
      let userRole = null;
      if (response.data.userRole) {
        userRole = response.data.userRole;
      } else if (response.data.role) {
        userRole = response.data.role;
      } else if (response.data.data && response.data.data.userRole) {
        userRole = response.data.data.userRole;
      } else if (response.data.data && response.data.data.role) {
        userRole = response.data.data.role;
      }
      
      userRole = userRole || "user";
      
      console.log("Extracted auth info:", {
        token: token ? "exists" : "missing",
        tokenValue: token ? token.substring(0, 10) + "..." : "none",
        userRole
      });
      
      if (!token) {
        throw new Error("No token found in response");
      }
      
      login(token, userRole);
      
      setTimeout(() => {
        console.log("After login - Local storage check:", {
          isLoggedIn: localStorage.getItem("isLoggedIn"),
          hasToken: !!localStorage.getItem("token"),
          storedToken: localStorage.getItem("token") ? "exists" : "missing",
          userRole: localStorage.getItem("userRole")
        });
      }, 100);
      
      navigate("/");
      
    } catch (error) {
      console.error("Login error:", error);
      if (error.response?.data?.error) {
        setErrors((prev) => ({ ...prev, server: error.response.data.error }));
      } else {
        setErrors((prev) => ({
          ...prev,
          server: error.message || "Login failed. Please try again later.",
        }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative flex flex-col justify-center items-center p-4 w-screen min-h-screen text-white">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/BGLogin.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Content */}
      <div className="relative flex flex-col mt-20 items-center w-full max-w-[555px]">
        <LoginHeader />
        <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit}>
          {/* Update PhoneInput to accept email or phone */}
          <PhoneInput 
            phone={emailOrPhone} 
            setPhone={setEmailOrPhone} 
            error={errors.emailOrPhone}
            placeholder="Enter email or phone number" // Add placeholder prop if your component supports it
          />
          <PasswordInput
            password={password}
            setPassword={setPassword}
            error={errors.password}
          />
          <RememberForgot remember={remember} setRemember={setRemember} />
          <LoginButton isSubmitting={isSubmitting} />
          {errors.server && (
            <div className="text-red-500 text-center">{errors.server}</div>
          )}
        </form>
        <div className="mb-10">
          <RegisterPrompt />
        </div>
      </div>
    </main>
  );
};

export default Login;