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
  const [emailOrPhone, setEmailOrPhone] = useState("");
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
        { emailOrPhone, password },
        { withCredentials: true }
      );

      console.log("Full login response:", response);
      console.log("Response data:", JSON.stringify(response.data, null, 2));
      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      // Check if login was successful based on status code
      if (response.status === 200 || response.status === 201) {
        // Extract token and role based on your backend response structure
        let token = null;
        let userRole = null;

        // Your backend returns: { message: 'Login successful', token: '...', userRole: '...' }
        // Extract token directly from response
        token = response.data.token;

        // Extract userRole (this comes from user.role in your database)
        userRole = response.data.userRole;

        console.log("Token extraction result:", {
          token: token ? "Found" : "Not found",
          tokenPreview: token ? token.substring(0, 20) + "..." : "none",
          userRole: userRole || "defaulting to user"
        });

        // If no token found, try to handle the response anyway
        if (!token) {
          console.warn("No token found in response. Response structure:", {
            keys: Object.keys(response.data),
            hasData: !!response.data.data,
            hasUser: !!response.data.user,
            fullResponse: response.data
          });

          // Check if the response indicates success without a token
          if (response.data.success === true || response.data.message === "Login successful") {
            // Create a temporary token or handle tokenless authentication
            console.log("Login appears successful but no token provided");
            setErrors((prev) => ({ 
              ...prev, 
              server: "Login successful but no authentication token received. Please contact support." 
            }));
            return;
          } else {
            throw new Error("No authentication token received from server");
          }
        }

        // Proceed with login
        userRole = userRole || "user";
        login(token, userRole);

        console.log("Login successful, navigating to home");
        navigate("/");

      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
      
    } catch (error) {
      console.error("Login error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });

      let errorMessage = "Login failed. Please try again.";

      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Handle specific error cases
      if (error.response?.status === 401) {
        errorMessage = "Invalid email/phone or password. Please try again.";
      } else if (error.response?.status === 404) {
        errorMessage = "Account not found. Please check your credentials.";
      } else if (error.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      }

      setErrors((prev) => ({ ...prev, server: errorMessage }));
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
          <PhoneInput 
            phone={emailOrPhone} 
            setPhone={setEmailOrPhone} 
            error={errors.emailOrPhone}
            placeholder="Enter email or phone number"
          />
          <PasswordInput
            password={password}
            setPassword={setPassword}
            error={errors.password}
          />
          <RememberForgot remember={remember} setRemember={setRemember} />
          <LoginButton isSubmitting={isSubmitting} />
          {errors.server && (
            <div className="text-red-500 text-center text-sm bg-red-100 bg-opacity-20 p-3 rounded-md">
              {errors.server}
            </div>
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