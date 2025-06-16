"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormField from "./FormField";

// Birth Chart Calculation Functions
const normalizeTimezone = (tz) => {
  if (!tz) {
    console.warn('Timezone không được cung cấp');
    return null;
  }
  
  // Handle GMT format (GMT +7, GMT +8, etc.)
  if (tz.startsWith('GMT ')) {
    const offset = tz.replace('GMT ', '');
    if (/^[+-]?\d+(\.\d+)?$/.test(offset)) {
      const offsetNum = parseFloat(offset);
      if (offsetNum >= -12 && offsetNum <= 14) {
        return `UTC${offsetNum >= 0 ? '+' : ''}${offsetNum}`;
      }
    }
  }
  
  if (/^[+-]?\d+(\.\d+)?$/.test(tz)) {
    const offset = parseFloat(tz);
    if (offset >= -12 && offset <= 14) {
      return `UTC${offset >= 0 ? '+' : ''}${offset}`;
    }
  }
  
  console.warn('Timezone không hợp lệ:', tz);
  return 'UTC+7'; // Default to Vietnam timezone
};


// Zodiac sign mapping
const ZODIAC_SIGNS = [
  "", "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

// More accurate Julian Date calculation
const calculateJulianDate = (year, month, day, hour, minute) => {
  // Convert to UT
  const ut = hour + minute / 60.0;
  
  // Julian Day calculation
  let a = Math.floor((14 - month) / 12);
  let y = year + 4800 - a;
  let m = month + 12 * a - 3;
  
  let jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + 
            Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  
  // Add time fraction
  let jd = jdn + (ut / 24.0) - 0.5;
  
  return jd;
};

// More accurate Sun position calculation
const calculateSunLongitude = (jd) => {
  // Days since J2000.0 (January 1, 2000, 12:00 UT)
  const n = jd - 2451545.0;
  
  // Mean longitude of the Sun (corrected formula)
  let L = (280.460 + 0.9856474 * n) % 360;
  if (L < 0) L += 360;
  
  // Mean anomaly of the Sun (corrected)
  let M = (357.528 + 0.9856003 * n) % 360;
  if (M < 0) M += 360;
  
  // Convert mean anomaly to radians
  const MRad = M * Math.PI / 180;
  
  // Equation of center (more accurate with additional terms)
  const C = 1.915 * Math.sin(MRad) + 
           0.020 * Math.sin(2 * MRad) + 
           0.0003 * Math.sin(3 * MRad);
  
  // True longitude of the Sun
  let trueLongitude = L + C;
  
  // Normalize to 0-360 degrees
  trueLongitude = trueLongitude % 360;
  if (trueLongitude < 0) trueLongitude += 360;
  
  return trueLongitude;
};

// Improved Moon position calculation
const calculateMoonLongitude = (jd) => {
  const n = jd - 2451545.0;
  
  // Mean longitude of the Moon
  let L = (218.316 + 13.176396 * n) % 360;
  if (L < 0) L += 360;
  
  // Mean anomaly of the Moon
  let M = (134.963 + 13.064993 * n) % 360;
  if (M < 0) M += 360;
  
  // Mean anomaly of the Sun
  let Ms = (357.529 + 0.985600 * n) % 360;
  if (Ms < 0) Ms += 360;
  
  // Moon's argument of latitude
  let F = (93.272 + 13.229350 * n) % 360;
  if (F < 0) F += 360;
  
  // Convert to radians
  const MRad = M * Math.PI / 180;
  const MsRad = Ms * Math.PI / 180;
  const FRad = F * Math.PI / 180;
  
  // Simplified perturbations
  const perturbation = 6.289 * Math.sin(MRad) +
                      1.274 * Math.sin(2 * (L - Ms) * Math.PI / 180) +
                      0.658 * Math.sin(2 * FRad) +
                      0.214 * Math.sin(2 * MRad) +
                      -0.186 * Math.sin(MsRad);
  
  let trueLongitude = L + perturbation;
  if (trueLongitude >= 360) trueLongitude -= 360;
  if (trueLongitude < 0) trueLongitude += 360;
  
  return trueLongitude;
};

// Calculate planet positions (simplified approximations)
const calculatePlanetLongitude = (jd, planetName) => {
  const n = jd - 2451545.0; // Days since J2000.0
  
  let longitude;
  
  switch (planetName.toLowerCase()) {
    case 'mercury':
      // Mercury: fast-moving planet
      longitude = (252.25 + 4.092317 * n) % 360;
      break;
    case 'venus':
      // Venus
      longitude = (181.98 + 1.602130 * n) % 360;
      break;
    case 'mars':
      // Mars
      longitude = (355.43 + 0.524039 * n) % 360;
      break;
    case 'jupiter':
      // Jupiter
      longitude = (34.35 + 0.083056 * n) % 360;
      break;
    case 'saturn':
      // Saturn
      longitude = (50.08 + 0.033371 * n) % 360;
      break;
    case 'uranus':
      // Uranus
      longitude = (314.05 + 0.011733 * n) % 360;
      break;
    case 'neptune':
      // Neptune
      longitude = (304.35 + 0.005982 * n) % 360;
      break;
    case 'pluto':
      // Pluto (simplified)
      longitude = (238.93 + 0.003968 * n) % 360;
      break;
    case 'chiron':
      // Chiron (simplified approximation)
      longitude = (77.00 + 0.002 * n) % 360;
      break;
    default:
      longitude = 0;
  }
  
  // Ensure positive longitude
  if (longitude < 0) longitude += 360;
  
  return longitude;
};

// Convert longitude to zodiac sign
const longitudeToSign = (longitude) => {
  return Math.floor(longitude / 30) + 1;
};

// Calculate Ascendant (simplified)
const calculateAscendant = (jd, latitude) => {
  // This is a very simplified calculation
  // Real ascendant calculation requires sidereal time and more complex math
  const lst = ((jd - 2451545.0) * 1.002737909 + 280.46061837) % 360;
  const ascLongitude = (lst + latitude * 0.5) % 360;
  return ascLongitude;
};

// Updated main calculation function
const calculateBirthChartAccurate = ({ date, time, birthPlace, latitude, longitude, tz }) => {
  try {
    console.log('Input hàm calculateBirthChartAccurate:', { date, time, birthPlace, latitude, longitude, tz });

    if (!date || !time || !birthPlace || !tz) {
      throw new Error(`Thiếu input: ${JSON.stringify({ date, time, birthPlace, tz })}`);
    }

    // Parse date and time
    const [year, month, day] = date.split('-').map(Number);
    let [hourStr, minuteStr] = time.replace(/\s?(AM|PM)/i, '').split(':');
    let hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);
    
    // Handle AM/PM conversion
    if (time.toUpperCase().includes('PM') && hour !== 12) {
      hour += 12;
    } else if (time.toUpperCase().includes('AM') && hour === 12) {
      hour = 0;
    }

    // Calculate Julian Date
    const jd = calculateJulianDate(year, month, day, hour, minute);
    console.log('Julian Date:', jd);

    // Default coordinates (Vietnam)
    const lat = latitude || 10.8231;
    const lon = longitude || 106.6297;

    // Calculate Sun position (most important for zodiac sign)
    const sunLongitude = calculateSunLongitude(jd);
    const sunSign = longitudeToSign(sunLongitude);
    
    // Calculate Moon position
    const moonLongitude = calculateMoonLongitude(jd);
    const moonSign = longitudeToSign(moonLongitude);
    
    // Calculate other planets
    const mercuryLongitude = calculatePlanetLongitude(jd, 'mercury');
    const mercurySign = longitudeToSign(mercuryLongitude);
    
    const venusLongitude = calculatePlanetLongitude(jd, 'venus');
    const venusSign = longitudeToSign(venusLongitude);
    
    const marsLongitude = calculatePlanetLongitude(jd, 'mars');
    const marsSign = longitudeToSign(marsLongitude);
    
    const jupiterLongitude = calculatePlanetLongitude(jd, 'jupiter');
    const jupiterSign = longitudeToSign(jupiterLongitude);
    
    const saturnLongitude = calculatePlanetLongitude(jd, 'saturn');
    const saturnSign = longitudeToSign(saturnLongitude);
    
    const neptuneL = calculatePlanetLongitude(jd, 'neptune');
    const neptuneSign = longitudeToSign(neptuneL);
    
    const plutoL = calculatePlanetLongitude(jd, 'pluto');
    const plutoSign = longitudeToSign(plutoL);
    
    const chironL = calculatePlanetLongitude(jd, 'chiron');
    const chironSign = longitudeToSign(chironL);
    
    // Calculate Ascendant
    const ascendantLongitude = calculateAscendant(jd, lat);
    const ascendantSign = longitudeToSign(ascendantLongitude);

    const chartData = {
      ascendant: { 
        sign: ascendantSign, 
        degree: Math.floor(ascendantLongitude % 30),
        zodiacName: ZODIAC_SIGNS[ascendantSign]
      },
      sun: { 
        sign: sunSign, 
        degree: Math.floor(sunLongitude % 30),
        zodiacName: ZODIAC_SIGNS[sunSign]
      },
      moon: { 
        sign: moonSign, 
        degree: Math.floor(moonLongitude % 30),
        zodiacName: ZODIAC_SIGNS[moonSign]
      },
      mercury: { 
        sign: mercurySign, 
        degree: Math.floor(mercuryLongitude % 30),
        zodiacName: ZODIAC_SIGNS[mercurySign]
      },
      venus: { 
        sign: venusSign, 
        degree: Math.floor(venusLongitude % 30),
        zodiacName: ZODIAC_SIGNS[venusSign]
      },
      mars: { 
        sign: marsSign, 
        degree: Math.floor(marsLongitude % 30),
        zodiacName: ZODIAC_SIGNS[marsSign]
      },
      jupiter: { 
        sign: jupiterSign, 
        degree: Math.floor(jupiterLongitude % 30),
        zodiacName: ZODIAC_SIGNS[jupiterSign]
      },
      saturn: { 
        sign: saturnSign, 
        degree: Math.floor(saturnLongitude % 30),
        zodiacName: ZODIAC_SIGNS[saturnSign]
      },
      neptune: { 
        sign: neptuneSign, 
        degree: Math.floor(neptuneL % 30),
        zodiacName: ZODIAC_SIGNS[neptuneSign]
      },
      pluto: { 
        sign: plutoSign, 
        degree: Math.floor(plutoL % 30),
        zodiacName: ZODIAC_SIGNS[plutoSign]
      },
      chiron: { 
        sign: chironSign, 
        degree: Math.floor(chironL % 30),
        zodiacName: ZODIAC_SIGNS[chironSign]
      }
    };

    console.log('Chart data tính được:', chartData);
    console.log(`Sun longitude: ${sunLongitude}°, Sign: ${ZODIAC_SIGNS[sunSign]}`);
    
    return { chartData };
    
  } catch (error) {
    console.error('Lỗi trong calculateBirthChartAccurate:', error);
    
    // Return default chart on error
    const defaultChart = {
      chartData: {
        ascendant: { sign: 1, degree: 0, zodiacName: "Aries" },
        sun: { sign: 1, degree: 0, zodiacName: "Aries" },
        moon: { sign: 1, degree: 0, zodiacName: "Aries" },
        mercury: { sign: 1, degree: 0, zodiacName: "Aries" },
        venus: { sign: 1, degree: 0, zodiacName: "Aries" },
        mars: { sign: 1, degree: 0, zodiacName: "Aries" },
        jupiter: { sign: 1, degree: 0, zodiacName: "Aries" },
        saturn: { sign: 1, degree: 0, zodiacName: "Aries" },
        neptune: { sign: 1, degree: 0, zodiacName: "Aries" },
        pluto: { sign: 1, degree: 0, zodiacName: "Aries" },
        chiron: { sign: 1, degree: 0, zodiacName: "Aries" }
      }
    };
    
    return defaultChart;
  }
};

// Function to save user astrology results to database
const saveUserAstrologyResults = async (userInfo, chartData) => {
  try {
    console.log('Saving user astrology results to database...');
    
    const payload = {
      PhoneNumber: userInfo.phone || userInfo.phoneNumber || userInfo.PhoneNumber || null,
      date: userInfo.birthDate,
      ascendant: chartData.ascendant.zodiacName,
      chiron: chartData.chiron.zodiacName,
      jupiter: chartData.jupiter.zodiacName,
      mars: chartData.mars.zodiacName,
      mercury: chartData.mercury.zodiacName,
      moon: chartData.moon.zodiacName,
      neptune: chartData.neptune.zodiacName,
      pluto: chartData.pluto.zodiacName,
      saturn: chartData.saturn.zodiacName,
      sun: chartData.sun.zodiacName,
      venus: chartData.venus.zodiacName
    };

    console.log('Payload to save:', payload);

    const response = await fetch('https://backend-docker-production-c584.up.railway.app/api/astrology/save-results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Successfully saved user astrology results:', result);
      return { success: true, data: result };
    } else {
      const errorText = await response.text();
      console.error('Failed to save user astrology results:', response.status, errorText);
      return { success: false, error: `HTTP ${response.status}: ${errorText}` };
    }
  } catch (error) {
    console.error('Error saving user astrology results:', error);
    return { success: false, error: error.message };
  }
};

// Function to fetch all interpretations for chart data
const fetchChartInterpretations = async (chartData) => {
  const interpretations = {};
  const planets = Object.keys(chartData);
  
  console.log('Starting to fetch interpretations for planets:', planets);
  console.log('Chart data:', chartData);
  
  try {
    // Create promises for all planet interpretations
    const interpretationPromises = planets.map(async (planet) => {
      const zodiacName = chartData[planet].zodiacName;
      
      try {
        const interpretation = await fetchPlanetInterpretation(planet, zodiacName);
        console.log(`Successfully fetched interpretation for ${planet}:`, interpretation);
        return { planet, interpretation, success: true };
      } catch (error) {
        console.error(`Failed to fetch interpretation for ${planet}:`, error);
        return { 
          planet, 
          interpretation: `Không thể tải giải thích cho ${planet} trong ${zodiacName}`, 
          success: false 
        };
      }
    });
    
    // Wait for all interpretations to load
    const results = await Promise.all(interpretationPromises);
    
    // Build interpretations object
    results.forEach(({ planet, interpretation, success }) => {
      interpretations[planet] = interpretation;
      if (!success) {
        console.warn(`Failed to load interpretation for ${planet}`);
      }
    });
    
    console.log('All interpretations loaded:', interpretations);
    return interpretations;
    
  } catch (error) {
    console.error('Error in fetchChartInterpretations:', error);
    
    // Return default interpretations object if error
    planets.forEach(planet => {
      const zodiacName = chartData[planet]?.zodiacName || 'Unknown';
      interpretations[planet] = `Không thể tải giải thích cho ${planet} trong ${zodiacName}`;
    });
    
    console.log('Returning default interpretations due to error:', interpretations);
    return interpretations;
  }
};

// Updated fetchPlanetInterpretation function with better error handling
const fetchPlanetInterpretation = async (planet, zodiacSign) => {
  try {
    console.log(`Making API call: https://backend-docker-production-c584.up.railway.app/api/astrology/${planet}/${zodiacSign}`);
    
    const response = await fetch(`https://backend-docker-production-c584.up.railway.app/api/astrology/${planet}/${zodiacSign}`);
    
    console.log(`API response status for ${planet}/${zodiacSign}:`, response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`API response data for ${planet}/${zodiacSign}:`, data);
      
      // Check if we got a valid description
      if (data.description && data.description.trim() !== '') {
        return data.description;
      } else {
        console.warn(`Empty description received for ${planet}/${zodiacSign}`);
        return `Không tìm thấy giải thích cho ${planet} trong ${zodiacSign}`;
      }
    } else {
      const errorText = await response.text();
      console.error(`API call failed for ${planet}/${zodiacSign}:`, response.status, errorText);
      return `Không thể tải giải thích cho ${planet} trong ${zodiacSign} (Lỗi: ${response.status})`;
    }
  } catch (error) {
    console.error(`Network error fetching interpretation for ${planet}/${zodiacSign}:`, error);
    return `Lỗi mạng khi tải giải thích cho ${planet} trong ${zodiacSign}`;
  }
};

const AstrologyForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);
  
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
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

useEffect(() => {
  const fetchUserProfile = async () => {
    try {
      setProfileLoading(true);
      
      // Check if user is logged in first
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      const token = localStorage.getItem("token");
      
      // Debug logging
      console.log("Debug - Auth check:", {
        isLoggedIn,
        hasToken: !!token,
        tokenLength: token ? token.length : 0,
        tokenPreview: token ? token.substring(0, 20) + "..." : "no token",
        allLocalStorageKeys: Object.keys(localStorage),
        tokenType: typeof token
      });
      
      if (!isLoggedIn || isLoggedIn !== "true" || !token) {
        console.log("User not logged in, skipping profile fetch");
        setProfileLoading(false);
        return;
      }

      // Additional token validation
      if (token === "null" || token === "undefined" || token.trim() === "") {
        console.error("Invalid token detected:", token);
        setProfileLoading(false);
        return;
      }

      console.log("Making API call with token:", token.substring(0, 20) + "...");

      const response = await apiClient.get("/auth/profile");

      console.log("Response status:", response.status);
      console.log("Response headers:", [...response.headers.entries()]);

      const profileData = response.data;
      console.log("Profile data received:", profileData);
      setUserProfile(profileData);
      setProfileError(null);
      
      if (profileData.fullName || profileData.fullname) {
        setFormData(prev => ({ ...prev, name: profileData.fullName || profileData.fullname }));
      }
      if (profileData.gender) {
        setFormData(prev => ({ ...prev, gender: profileData.gender }));
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      console.error("Error response:", error.response?.data);
      setProfileError(error.response?.data?.message || "Không thể kết nối đến server");
    } finally {
      setProfileLoading(false);
    }
  };

  fetchUserProfile();
}, []);

  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    gender: "",
    birthDay: "",
    birthMonth: "",
    birthYear: "",
    birthHour: "",
    birthMinute: "",
    birthPeriod: "",
    timezone: "GMT +7",
    birthplace: "",
  });

  const [isCalculating, setIsCalculating] = useState(false);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const generateOptions = (count, padStart = true) => {
    return Array.from({ length: count }, (_, i) => ({
      value: i + 1,
      label: padStart
        ? (i + 1).toString().padStart(2, "0")
        : (i + 1).toString(),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCalculating(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.birthDay || !formData.birthMonth || !formData.birthYear || 
          !formData.birthHour || !formData.birthMinute || !formData.birthPeriod || !formData.birthplace) {
        alert("Vui lòng điền đầy đủ thông tin!");
        setIsCalculating(false);
        return;
      }

      // Combine birth date and time fields
      const birthDate = `${formData.birthYear}-${formData.birthMonth.padStart(2, "0")}-${formData.birthDay.padStart(2, "0")}`;
      const birthTime = `${formData.birthHour.padStart(2, "0")}:${formData.birthMinute.padStart(2, "0")} ${formData.birthPeriod}`;

      // Calculate birth chart locally
      const birthChartData = calculateBirthChartAccurate({
        date: birthDate,
        time: birthTime,
        birthPlace: formData.birthplace,
        latitude: null,
        longitude: null,
        tz: formData.timezone
      });

      // Fetch interpretations from database
      console.log('Bắt đầu tải giải thích từ database...');
      const interpretations = await fetchChartInterpretations(birthChartData.chartData);

      // Get phone number from user profile
      const phoneNumber = userProfile?.phoneNumber || 
                         userProfile?.phone || 
                         userProfile?.mobile || 
                         userProfile?.data?.phoneNumber ||
                         userProfile?.data?.phone ||
                         null;

      // Create user info object
      const userInfo = {
        name: formData.name,
        nickname: formData.nickname,
        gender: formData.gender,
        birthDate,
        birthTime,
        birthPlace: formData.birthplace,
        timezone: formData.timezone,
        phoneNumber: phoneNumber,
      };

      // Save user astrology results to database
      console.log('Saving astrology results to database...');
      const saveResult = await saveUserAstrologyResults(userInfo, birthChartData.chartData);
      
      if (saveResult.success) {
        console.log('User astrology results saved successfully');
      } else {
        console.warn('Failed to save user astrology results:', saveResult.error);
      }

      const payload = {
        name: formData.name,
        nickname: formData.nickname,
        gender: formData.gender,
        birthDate,
        birthTime,
        birthPlace: formData.birthplace,
        timezone: formData.timezone,
        phoneNumber: phoneNumber,
        chartData: birthChartData.chartData,
        interpretations
      };

      // Navigate to results page with data including database interpretations
      navigate("/astrology/result", {
        state: {
          result: {
            data: {
              success: true,
              data: payload,
              source: 'local_calculation_with_db_interpretations',
              savedToDatabase: saveResult.success
            },
            chartData: birthChartData.chartData,
            interpretations: interpretations,
            userInfo: userInfo
          },
        },
      });

    } catch (error) {
      console.error("Error processing form:", error);
      alert("Có lỗi xảy ra khi xử lý thông tin. Vui lòng thử lại!");
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <section className="p-10 rounded bg-neutral-900 bg-opacity-50 max-w-[1200px] w-[100%]">
      {userProfile && !profileLoading && (
        <div className="bg-green-600 text-white p-3 rounded-md mb-4">
          <p>✓ Đã kết nối với tài khoản: {userProfile.name || userProfile.fullname || 'Người dùng'}</p>
          {userProfile.phoneNumber || userProfile.phone ? (
            <p className="text-sm opacity-90">Kết quả sẽ được lưu vào lịch sử tra cứu với số: {userProfile.phoneNumber || userProfile.phone}</p>
          ) : (
            <p className="text-sm opacity-90">Không tìm thấy số điện thoại - kết quả sẽ không được lưu</p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <FormField
          label="Nhập họ tên khai sinh:"
          placeholder="Nhập đủ họ và tên khai sinh"
          value={formData.name}
          onChange={handleChange("name")}
          className="w-full"
          required
        />

        <div className="flex flex-col gap-2.5">
          <label className="text-sm font-bold tracking-widest text-white">
            Tên thường dùng nếu có (Vd: Dyan, Ngọc Nhím,...)
          </label>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Nhập tên thường dùng nếu có"
              className="px-5 h-10 text-sm tracking-widest bg-black flex-[grow] text-neutral-400"
              value={formData.nickname}
              onChange={handleChange("nickname")}
            />
            <select
              className="px-5 h-10 text-sm tracking-widest bg-black text-neutral-400 w-[150px]"
              value={formData.gender}
              onChange={handleChange("gender")}
            >
              <option value="">Giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <label className="text-sm font-bold tracking-widest text-white">
            Ngày/tháng/năm sinh dương lịch *
          </label>
          <div className="flex gap-4">
            <select
              className="px-5 h-10 text-sm tracking-widest bg-black text-neutral-400 w-[150px]"
              value={formData.birthDay}
              onChange={handleChange("birthDay")}
              required
            >
              <option value="">Ngày</option>
              {generateOptions(31).map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <select
              className="px-5 h-10 text-sm tracking-widest bg-black text-neutral-400 w-[150px]"
              value={formData.birthMonth}
              onChange={handleChange("birthMonth")}
              required
            >
              <option value="">Tháng</option>
              {generateOptions(12).map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Năm sinh"
              className="px-5 h-10 text-sm tracking-widest bg-black text-neutral-400 w-[150px]"
              value={formData.birthYear}
              onChange={handleChange("birthYear")}
              min="1900"
              max="2030"
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <label className="text-sm font-bold tracking-widest text-white">
            Giờ sinh *
          </label>
          <div className="flex gap-4">
            <select
              className="px-5 h-10 text-sm tracking-widest bg-black text-neutral-400 w-[150px]"
              value={formData.birthHour}
              onChange={handleChange("birthHour")}
              required
            >
              <option value="">Giờ</option>
              {generateOptions(12).map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <select
              className="px-5 h-10 text-sm tracking-widest bg-black text-neutral-400 w-[150px]"
              value={formData.birthMinute}
              onChange={handleChange("birthMinute")}
              required
            >
              <option value="">Phút</option>
              {generateOptions(60, false).map(({ value, label }) => (
                <option key={value} value={value - 1}>
                  {(value - 1).toString().padStart(2, "0")}
                </option>
              ))}
            </select>
            <select
              className="px-5 h-10 text-sm tracking-widest bg-black text-neutral-400 w-[150px]"
              value={formData.birthPeriod}
              onChange={handleChange("birthPeriod")}
              required
            >
              <option value="">Buổi</option>
              <option value="AM">Sáng</option>
              <option value="PM">Chiều</option>
            </select>
          </div>
        </div>

        <FormField
          label="Múi giờ"
          type="select"
          value={formData.timezone}
          onChange={handleChange("timezone")}
          options={[
            { value: "GMT +7", label: "GMT +7" },
            { value: "GMT +8", label: "GMT +8" },
            { value: "GMT +9", label: "GMT +9" },
            { value: "GMT +6", label: "GMT +6" },
            { value: "GMT +5", label: "GMT +5" },
          ]}
          className="w-[150px]"
        />

        <FormField
          label="Nơi sinh *"
          placeholder="Nhập nơi sinh"
          value={formData.birthplace}
          onChange={handleChange("birthplace")}
          className="w-full"
          required
        />

        <button
          type="submit"
          disabled={isCalculating}
          className="self-center mt-5 cursor-pointer text-lg text-white bg-yellow-600 h-[50px] tracking-[2.7px] w-[250px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCalculating ? "Đang tính toán..." : "Tạo Bản Đồ Sao"}
        </button>
      </form>
    </section>
  );
};

export default AstrologyForm;