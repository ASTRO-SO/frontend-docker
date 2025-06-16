import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // Added Link import
import FormHeader from "./FormHeader";
import FormInput from "./FormInput";
import PasswordInput from "./PasswordInput";
import ErrorMessage from "./ErrorMessage";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone: "",
    fullname: "",
    password: "",
    confirmPassword: "",
    email: "",
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState("");

  const validateForm = () => {
    const newErrors = {};

    if (!formData.phone) {
      newErrors.phone = "Phone is required";
    } else if (formData.phone.length < 9 || isNaN(formData.phone)) {
      newErrors.phone = "Phone must be at least 9 digits and numeric";
    }
    if (!formData.fullname) {
      newErrors.fullname = "fullname is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = "You must agree to the Terms of Service";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMessage("");
    if (validateForm()) {
      try {
        const response = await axios.post(
          "https://backend-docker-production-c584.up.railway.app/api/auth/signup",
          formData,
          { withCredentials: true }
        );
        // On successful signup, redirect to login page
        navigate("/login");
      } catch (error) {
        console.error("Signup error:", error);
        if (error.response?.data?.error) {
          // Display backend error message.
          setServerMessage(error.response.data.error);
        } else {
          setServerMessage("Signup failed. Your phone number may be used or website is down.");
        }
      }
    }
  };

  return (
    <main className="relative min-h-screen w-full font-sans text-white py-8 px-4 overflow-hidden">
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
    
      {/* Content Container */}
      <div className="relative max-w-[600px] mx-auto">
        <FormHeader />
    
        <form onSubmit={handleSubmit} className="flex flex-col gap-[24px]">
          <div className="flex gap-[16px] bg-[#131114] rounded-[10px] p-[20px] border-[1px] border-[#2D2C2E]">
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="Phone number (ex. 0123456789)"
              className="bg-transparent flex-1 outline-none text-[16px]"
            />
          </div>
          {errors.phone && <ErrorMessage message={errors.phone} />}
    
          <FormInput
            type="text"
            value={formData.fullname}
            onChange={(e) => handleInputChange("fullname", e.target.value)}
            placeholder="Full name"
          />
          {errors.fullname && <ErrorMessage message={errors.fullname} />}
    
          <PasswordInput
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            placeholder="Password"
          />
          {errors.password && <ErrorMessage message={errors.password} />}
    
          <PasswordInput
            value={formData.confirmPassword}
            onChange={(e) =>
              handleInputChange("confirmPassword", e.target.value)
            }
            placeholder="Confirm Password"
          />
          {errors.confirmPassword && (
            <ErrorMessage message={errors.confirmPassword} />
          )}
    
          <FormInput
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="Email (optional)"
          />
    
          <div className="flex items-center gap-[8px] mb-8">
            <input
              type="checkbox"
              id="terms"
              checked={formData.termsAccepted}
              onChange={(e) =>
                handleInputChange("termsAccepted", e.target.checked)
              }
              className="w-5 h-5 bg-[#131114] border-[1px] border-[#2D2C2E] rounded-[4px]"
            />
            <label htmlFor="terms" className="text-[16px]">
              I agree to the{" "}
              <Link 
                to="/termofservice" 
                className="text-white underline hover:text-blue-300"
                onClick={(e) => e.stopPropagation()}
              >
                Terms of Service
              </Link>
            </label>
          </div>
          {errors.termsAccepted && <ErrorMessage message={errors.termsAccepted} />}
    
          <button
            type="submit"
            className="bg-[#2D2C2E] text-white font-semibold py-[20px] px-[40px] rounded-full text-[18px] tracking-[1.8px] transform transition-transform duration-200 hover:scale-[1.02]"
          >
            Sign Up
          </button>
    
          {serverMessage && <ErrorMessage message={serverMessage} />}
        </form>
    
        <footer className="flex justify-center items-center gap-[16px] mt-8">
          <p className="text-[#999999] text-[18px]">Already have an account?</p>
          <a href="/login" className="text-white text-[18px] hover:underline">
            Login now
          </a>
        </footer>
      </div>
    </main>
  );
};

export default SignUp;