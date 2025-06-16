import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../Homepage/Header";
import { useAuth } from "../../AuthProvider";

const ResultBlock = ({ title, subTitle, description }) => (
  <section className="mb-[32px] bg-[#000] bg-opacity-[0.7] p-[24px] rounded-[8px] shadow-md">
    <h2 className="text-[22px] font-bold text-[#F2FF00] tracking-[1.8px] mb-[8px]">
      {title}
    </h2>
    <h3 className="text-[18px] font-semibold mb-[8px] text-white">
      {subTitle}
    </h3>
    <p className="text-[14px] text-[#DDD] leading-[22px] whitespace-pre-line">
      {description.replace(/\\n/g, "\n")}
    </p>
  </section>
);

// Zodiac sign names
const ZODIAC_SIGNS = [
  "", "Bạch Dương", "Kim Ngưu", "Song Tử", "Cự Giải", "Sư Tử", "Xử Nữ",
  "Thiên Bình", "Thần Nông", "Nhân Mã", "Ma Kết", "Bảo Bình", "Song Ngư"
];

const ZODIAC_SIGNS_EN = [
  "", "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

// Planet names in Vietnamese
const PLANET_NAMES = {
  sun: "Mặt Trời",
  moon: "Mặt Trăng", 
  mercury: "Sao Thủy",
  venus: "Sao Kim",
  mars: "Sao Hỏa",
  jupiter: "Sao Mộc",
  saturn: "Sao Thổ",
  neptune: "Sao Hải Vương",
  pluto: "Sao Diêm Vương",
  chiron: "Chiron",
  ascendant: "Thiên Đình"
};

const formatChartData = (chartData, userInfo, interpretations = {}) => {
  if (!chartData) return null;

  const formatPlanetData = (planetKey, planetData) => {
    const sign = planetData.sign;
    const degree = planetData.degree;
    const planetName = PLANET_NAMES[planetKey];
    const signName = ZODIAC_SIGNS[sign];
    const signNameEn = ZODIAC_SIGNS_EN[sign];
    
    // Use database interpretation if available, otherwise fallback to default message
    const description = interpretations[planetKey] || 
      `Không có giải thích cho ${planetName} trong ${signName}`;
    
    return {
      title: planetName,
      subTitle: `${signName} (${signNameEn}) - ${degree}°`,
      description: description
    };
  };

  return {
    sun: formatPlanetData('sun', chartData.sun),
    moon: formatPlanetData('moon', chartData.moon),
    mercury: formatPlanetData('mercury', chartData.mercury),
    venus: formatPlanetData('venus', chartData.venus),
    mars: formatPlanetData('mars', chartData.mars),
    jupiter: formatPlanetData('jupiter', chartData.jupiter),
    saturn: formatPlanetData('saturn', chartData.saturn),
    neptune: formatPlanetData('neptune', chartData.neptune),
    pluto: formatPlanetData('pluto', chartData.pluto),
    chiron: formatPlanetData('chiron', chartData.chiron),
    ascendant: formatPlanetData('ascendant', chartData.ascendant)
  };
};

const UserInfoBlock = ({ userInfo }) => (
  <section className="mb-[32px] bg-[#1a1a1a] bg-opacity-[0.9] p-[24px] rounded-[8px] shadow-md border border-yellow-600">
    <h2 className="text-[24px] font-bold text-[#F2FF00] tracking-[1.8px] mb-[16px] text-center">
      Bản Đồ Sao Của {userInfo.name}
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
      <div>
        <span className="font-semibold text-yellow-400">Tên khai sinh:</span> {userInfo.name}
      </div>
      {userInfo.nickname && (
        <div>
          <span className="font-semibold text-yellow-400">Tên thường gọi:</span> {userInfo.nickname}
        </div>
      )}
      {userInfo.gender && (
        <div>
          <span className="font-semibold text-yellow-400">Giới tính:</span> {userInfo.gender === 'male' ? 'Nam' : 'Nữ'}
        </div>
      )}
      <div>
        <span className="font-semibold text-yellow-400">Ngày sinh:</span> {userInfo.birthDate}
      </div>
      <div>
        <span className="font-semibold text-yellow-400">Giờ sinh:</span> {userInfo.birthTime}
      </div>
      <div>
        <span className="font-semibold text-yellow-400">Nơi sinh:</span> {userInfo.birthPlace}
      </div>
      <div>
        <span className="font-semibold text-yellow-400">Múi giờ:</span> {userInfo.timezone}
      </div>
    </div>
  </section>
);

const AstrologyResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Get data from location state
  const resultData = location.state?.result;
  
  if (!resultData) {
    navigate("/astrology");
    return null;
  }

  // Check if we have the new integrated data structure
  const chartData = resultData.chartData;
  const userInfo = resultData.userInfo;
  const interpretations = resultData.interpretations || {}; // Get interpretations from database
  const apiData = resultData.data;

  console.log('Interpretations received in result:', interpretations);

  // If we have chartData (from integrated form), format it with database interpretations
  let formattedData;
  if (chartData && userInfo) {
    formattedData = formatChartData(chartData, userInfo, interpretations);
  } else if (apiData) {
    // If we have the old API data structure, use it directly
    formattedData = apiData;
  } else {
    navigate("/astrology");
    return null;
  }

  const {
    sun,
    moon,
    mercury,
    venus,
    mars,
    jupiter,
    saturn,
    neptune,
    pluto,
    chiron,
    ascendant,
  } = formattedData;

  return (
    <div
      className="text-white relative min-h-screen"
      style={{
        backgroundImage: "url(/NumerologyBG.jpg)",
        backgroundSize: "cover",
        backgroundRepeat: "repeat-y",
        backgroundPosition: "top center",
      }}
    >
      <Header />

      <div className="max-w-[1000px] mx-auto p-[24px] pt-[40px] relative z-10">
        {/* User Info Section */}
        {userInfo && <UserInfoBlock userInfo={userInfo} />}
        
        {/* Astrology Chart Image */}
        <div className="w-full flex justify-center mb-[32px]">
          <img
            src="/astrology-wheel.png"
            alt="Astrology Chart"
            className="w-[200px] h-auto"
          />
        </div>

        {/* Chart Results */}
        <div className="mb-[24px]">
          <h3 className="text-[20px] font-bold text-[#F2FF00] tracking-[1.8px] mb-[16px] text-center">
            Phân Tích Chi Tiết Bản Đồ Sao
          </h3>
        </div>

        {sun && <ResultBlock {...sun} />}
        {moon && <ResultBlock {...moon} />}
        {mercury && <ResultBlock {...mercury} />}
        {venus && <ResultBlock {...venus} />}
        {mars && <ResultBlock {...mars} />}
        {jupiter && <ResultBlock {...jupiter} />}
        {saturn && <ResultBlock {...saturn} />}
        {neptune && <ResultBlock {...neptune} />}
        {pluto && <ResultBlock {...pluto} />}
        {chiron && <ResultBlock {...chiron} />}
        {ascendant && <ResultBlock {...ascendant} />}

        {/* Back to Form Button */}
        <div className="flex justify-center mt-[40px] mb-[20px]">
          <button
            onClick={() => navigate("/astrology")}
            className="px-8 py-3 bg-yellow-600 text-white font-semibold tracking-[1.5px] rounded hover:bg-yellow-700 transition-colors"
          >
            Tạo Bản Đồ Sao Mới
          </button>
        </div>
      </div>
    </div>
  );
};

export default AstrologyResult;