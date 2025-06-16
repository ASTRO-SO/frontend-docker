"use client";
import React, { useState, useEffect } from "react";
import FormInput from "./FormInput";
import NumerologyNotes from "./NumerologyNotes";
import { useNavigate } from "react-router-dom";
import {
  calculateLifePathNumber,
  calculateDestinyNumber,
  calculateSoulUrgeNumber,
  calculatePersonalityNumber,
  calculateNaturalAbilityNumber,
  calculateMaturityNumber,
  calculateAttitudeNumber,
  calculateChallengeNumbers
} from "./ResultCalculate";

const NumerologyForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    nickname: "",
    birthDay: "",
    birthMonth: "",
    birthYear: "",
    gender: "",
  });
  
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
    
    // Hide alert when user starts typing again
    if (showAlert) {
      setShowAlert(false);
    }
  };

  const navigate = useNavigate(); 

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setProfileLoading(true);
        const response = await fetch("backend-docker-production-c584.up.railway.app/api/auth/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Add authorization header if you're using JWT tokens
            // "Authorization": `Bearer ${localStorage.getItem('token')}`
          },
          credentials: 'include' // Include cookies if using session-based auth
        });

        if (response.ok) {
          const profileData = await response.json();
          setUserProfile(profileData);
          setProfileError(null);
          
          // Auto-fill form data if available in profile
          if (profileData.fullName) {
            setFormData(prev => ({ ...prev, fullName: profileData.fullName }));
          }
          if (profileData.gender) {
            setFormData(prev => ({ ...prev, gender: profileData.gender }));
          }
        } else {
          const errorData = await response.json();
          setProfileError(errorData.message || "Failed to fetch user profile");
          console.error("Failed to fetch user profile:", response.statusText);
        }
      } catch (error) {
        setProfileError("Unable to connect to profile service");
        console.error("Error fetching user profile:", error);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const calculateNumerology = async () => {
    const { fullName, birthDay, birthMonth, birthYear } = formData;

    if (!fullName || !birthDay || !birthMonth || !birthYear) {
      setShowAlert(true);
      return;
    }

    setShowAlert(false);
    setIsLoading(true);

    // Format date for calculation functions (DD/MM/YYYY)
    const dateForCalculation = `${birthDay.padStart(2, "0")}/${birthMonth.padStart(2, "0")}/${birthYear}`;
    
    try {
      // Calculate all numbers locally
      const lifePathNumber = calculateLifePathNumber(dateForCalculation);
      const destinyNumber = calculateDestinyNumber(fullName);
      const soulUrgeNumber = calculateSoulUrgeNumber(fullName);
      const personalityNumber = calculatePersonalityNumber(fullName);
      const naturalAbilityNumber = calculateNaturalAbilityNumber(dateForCalculation);
      const maturityNumber = calculateMaturityNumber(lifePathNumber, destinyNumber);
      const attitudeNumber = calculateAttitudeNumber(dateForCalculation);
      const challengeNumbers = calculateChallengeNumbers(dateForCalculation);

      // Prepare numbers to fetch from database
      const numbersToFetch = {
        lifePathNumber,
        destinyNumber,
        soulUrgeNumber,
        personalityNumber,
        naturalAbilityNumber,
        maturityNumber,
        attitudeNumber,
        challenge1: challengeNumbers.challenge1,
        challenge2: challengeNumbers.challenge2,
        challenge3: challengeNumbers.challenge3,
        challenge4: challengeNumbers.challenge4
      };

      // Get phone number from user profile - try multiple possible field names
      const phoneNumber = userProfile?.phoneNumber || 
                         userProfile?.phone || 
                         userProfile?.mobile || 
                         userProfile?.data?.phoneNumber ||
                         userProfile?.data?.phone ||
                         null;

      // Call API to get meanings from database
      const response = await fetch("backend-docker-production-c584.up.railway.app/api/numerology/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add authorization header if needed
          // "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          fullName, 
          date: dateForCalculation,
          numbers: numbersToFetch,
          phoneNumber: phoneNumber
        }),
        credentials: 'include' // Include cookies if using session-based auth
      });

      const result = await response.json();

      if (response.ok) {
        // Navigate to result page
        navigate("/numerology/result", { state: { result } });
      } else {
        alert(result.error || "Đã xảy ra lỗi khi gọi API.");
      }
    } catch (err) {
      console.error("Lỗi gọi API:", err);
      alert("Không thể kết nối đến máy chủ.");
    } finally {
      setIsLoading(false);
    }
  };

  const genderOptions = [
    { value: "", label: "Chọn giới tính" },
    { value: "male", label: "Nam" },
    { value: "female", label: "Nữ" },
  ];

  return (
    <div className="bg-[#131114] bg-opacity-[0.5] rounded-[8px] p-[40px]">
      <div className="space-y-[24px]">
        {/* Profile loading indicator */}
        {profileLoading && (
          <div className="bg-blue-500 text-white p-4 rounded-md mb-4">
            <p>Đang tải thông tin người dùng...</p>
          </div>
        )}

        {/* Profile error indicator */}
        {profileError && (
          <div className="bg-yellow-500 text-white p-4 rounded-md mb-4 flex items-center justify-between">
            <p>⚠️ Không thể tải thông tin người dùng: {profileError}</p>
            <button 
              onClick={() => setProfileError(null)}
              className="text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        )}

        {/* User info indicator */}
        {userProfile && !profileLoading && (
          <div className="bg-green-600 text-white p-3 rounded-md mb-4">
            <p>✓ Đã kết nối với tài khoản: {userProfile.name || userProfile.fullname || 'Người dùng'}</p>
            {userProfile.phoneNumber || userProfile.phone ? (
              <p className="text-sm opacity-90">Kết quả sẽ được lưu vào lịch sử tra cứu với số: {userProfile.phone}</p>
            ) : (
              <p className="text-sm opacity-90">Không tìm thấy số điện thoại - kết quả sẽ không được lưu</p>
            )}
          </div>
        )}

        {showAlert && (
          <div className="bg-red-500 text-white p-4 rounded-md mb-4 flex items-center justify-between">
            <p>Vui lòng điền đầy đủ thông tin trước khi tra cứu!</p>
            <button 
              onClick={() => setShowAlert(false)}
              className="text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        )}

        <FormInput
          label="Nhập họ tên khai sinh:"
          placeholder="Nhập đủ họ và tên khai sinh"
          value={formData.fullName}
          onChange={handleInputChange("fullName")}
        />

        <FormInput
          label="Tên thường dùng nếu có (Vd: Dyan, Ngọc Nhím,...):"
          placeholder="Nhập tên thường dùng nếu có"
          value={formData.nickname}
          onChange={handleInputChange("nickname")}
        />

        <div className="grid grid-cols-4 gap-[16px]">
          <FormInput
            label="Ngày sinh"
            type="number"
            placeholder="Ngày"
            value={formData.birthDay}
            onChange={handleInputChange("birthDay")}
            min="1"
            max="31"
          />

          <FormInput
            label="Tháng sinh"
            type="number"
            placeholder="Tháng"
            value={formData.birthMonth}
            onChange={handleInputChange("birthMonth")}
            min="1"
            max="12"
          />

          <FormInput
            label="Năm sinh"
            type="number"
            placeholder="Năm"
            value={formData.birthYear}
            onChange={handleInputChange("birthYear")}
            min="1900"
            max="2099"
          />

          <FormInput
            label="Giới tính"
            type="select"
            value={formData.gender}
            onChange={handleInputChange("gender")}
            options={genderOptions}
          />
        </div>

        <button
          onClick={calculateNumerology}
          disabled={isLoading || profileLoading}
          className="w-full h-[50px] bg-[#A81B8C] cursor-pointer rounded-[4px] text-[20px] font-semibold tracking-[2px] flex items-center justify-center gap-[8px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <img
            src="/9841722.png"
            alt="Search"
            className="w-[25px] h-[25px]"
          />
          <span>
            {isLoading ? "Đang tính toán..." : 
             profileLoading ? "Đang tải..." : 
             "Tra cứu"}
          </span>
        </button>

        <NumerologyNotes />
      </div>
    </div>
  );
};

export default NumerologyForm;