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
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Get the login function from context
  const [errors, setErrors] = useState({
    phone: "",
    password: "",
    server: ""
  });

  const validate = () => {
    const newErrors = {
      phone: phone.length < 9 ? "Phone number must be at least 9 digits" : "",
      password: password.length < 8 ? "Password must be at least 8 characters" : "",
    };
    setErrors((prev) => ({ ...prev, ...newErrors }));
    // Return true if there are no validation errors
    return !newErrors.phone && !newErrors.password;
  };

  
const handleSubmit = async (event) => {
  event.preventDefault();
  // Clear any previous server errors
  setErrors((prev) => ({ ...prev, server: "" }));
  if (!validate()) return;

  try {
    setIsSubmitting(true);
    console.log("Attempting login with:", { phone });
    
    const response = await axios.post(
      "backend-docker-production-c584.up.railway.app/api/auth/login",
      { phone, password },
      { withCredentials: true }
    );

    console.log("Login response:", response.data);
    
    // More detailed logging to debug the response structure
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
    
    // Default to "user" if no role is found
    userRole = userRole || "user";
    
    console.log("Extracted auth info:", {
      token: token ? "exists" : "missing",
      tokenValue: token ? token.substring(0, 10) + "..." : "none",
      userRole
    });
    
    if (!token) {
      throw new Error("No token found in response");
    }
    
    // Use the context's login function
    login(token, userRole);
    
    // Verify login state was set properly
    setTimeout(() => {
      console.log("After login - Local storage check:", {
        isLoggedIn: localStorage.getItem("isLoggedIn"),
        hasToken: !!localStorage.getItem("token"),
        storedToken: localStorage.getItem("token") ? "exists" : "missing",
        userRole: localStorage.getItem("userRole")
      });
    }, 100);
    
    // Navigate to home page
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
      <PhoneInput phone={phone} setPhone={setPhone} error={errors.phone} />
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