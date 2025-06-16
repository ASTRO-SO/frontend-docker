import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../Homepage/Header";

const ResultBlock = ({ title, number, subTitle, description }) => (
  <section className="mb-[32px] bg-[#000] bg-opacity-[0.7] p-[24px] rounded-[8px] shadow-md">
    <h2 className="text-[22px] font-bold text-[#F2FF00] tracking-[1.8px] mb-[8px]">
      {title}: {number}
    </h2>
    {subTitle && (
      <h3 className="text-[18px] font-semibold mb-[8px] text-white">
        {subTitle}
      </h3>
    )}
    <p className="text-[14px] text-[#DDD] leading-[22px] whitespace-pre-line">
      {description ? description.replace(/\\n/g, '\n') : 'Chưa có thông tin cho số này.'}
    </p>
  </section>
);

const NumerologyResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state?.result?.data || null;

  if (!data) {
    navigate("/numerology");
    return null;
  }

  const {
    fullName,
    date,
    lifePathNumber,
    lifePathTitle,
    lifePathDescription,
    destinyNumber,
    destinyTitle,
    destinyDescription,
    soulUrgeNumber,
    soulUrgeTitle,
    soulUrgeDescription,
    personalityNumber,
    personalityTitle,
    personalityDescription,
    naturalAbilityNumber,
    naturalAbilityTitle,
    naturalAbilityDescription,
    maturityNumber,
    maturityTitle,
    maturityDescription,
    attitudeNumber,
    attitudeTitle,
    attitudeDescription,
    challenges,
  } = data;

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
        <div className="bg-[#000] bg-opacity-[0.8] p-[24px] rounded-[8px] mb-[32px] text-center">
          <h1 className="text-[28px] font-bold text-[#F2FF00] mb-[8px]">
            Kết Quả Thần Số Học
          </h1>
          <p className="text-[18px] text-white mb-[4px]">
            <strong>Họ tên:</strong> {fullName}
          </p>
          <p className="text-[16px] text-[#DDD]">
            <strong>Ngày sinh:</strong> {date}
          </p>
        </div>

        <div className="w-full flex justify-center mb-[32px]">
          <img
            src="/bieu-do-ten-trong-than-so-hoc.webp"
            alt="Numerology Result"
            className="w-[200px] h-auto"
          />
        </div>

        <ResultBlock
          title="Số Chủ Đạo (Life Path)"
          number={lifePathNumber}
          subTitle={lifePathTitle}
          description={lifePathDescription}
        />

        <ResultBlock
          title="Số Định Mệnh (Destiny)"
          number={destinyNumber}
          subTitle={destinyTitle}
          description={destinyDescription}
        />

        <ResultBlock
          title="Số Linh Hồn (Soul Urge)"
          number={soulUrgeNumber}
          subTitle={soulUrgeTitle}
          description={soulUrgeDescription}
        />

        <ResultBlock
          title="Số Nhân Cách (Personality)"
          number={personalityNumber}
          subTitle={personalityTitle}
          description={personalityDescription}
        />

        <ResultBlock
          title="Năng Lực Tự Nhiên (Natural Ability)"
          number={naturalAbilityNumber}
          subTitle={naturalAbilityTitle}
          description={naturalAbilityDescription}
        />

        <ResultBlock
          title="Số Trưởng Thành (Maturity)"
          number={maturityNumber}
          subTitle={maturityTitle}
          description={maturityDescription}
        />

        <ResultBlock
          title="Số Thái Độ (Attitude)"
          number={attitudeNumber}
          subTitle={attitudeTitle}
          description={attitudeDescription}
        />

        {/* Challenge Numbers Section */}
        <div className="bg-[#000] bg-opacity-[0.8] p-[24px] rounded-[8px] mb-[32px]">
          <h2 className="text-[24px] font-bold text-[#F2FF00] mb-[16px] text-center">
            Các Số Thách Thức
          </h2>
          
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="mb-[24px] last:mb-0">
              <ResultBlock
                title={`Thử Thách ${i}`}
                number={challenges[`challenge${i}`]}
                subTitle={challenges[`challenge${i}Title`]}
                description={challenges[`challenge${i}Description`]}
              />
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-[16px] justify-center mt-[40px]">
          <button
            onClick={() => navigate("/numerology")}
            className="bg-[#A81B8C] hover:bg-[#8B1572] px-[24px] py-[12px] rounded-[4px] text-white font-semibold transition-colors"
          >
            Tính Toán Lại
          </button>
          
          <button
            onClick={() => window.print()}
            className="bg-[#4A90A4] hover:bg-[#357A8A] px-[24px] py-[12px] rounded-[4px] text-white font-semibold transition-colors"
          >
            In Kết Quả
          </button>
        </div>
      </div>
    </div>
  );
};

export default NumerologyResult;