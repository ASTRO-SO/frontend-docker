"use client";
import React from "react";
import Header from "../Homepage/Header";
import AstrologyForm from "./AstrologyForm";

const AstrologyCalculator = () => {
  return (
    <div className="flex overflow-hidden flex-col relative">
      <Header />
      <main className="flex flex-col items-center min-h-screen w-screen text-[#FFF] relative">
        {/* Video background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
        >
          <source src="/video2.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="w-full max-w-[1200px] mt-[40px] mb-[80px] relative z-10">
          <header className="text-center mb-[40px]">
            <div className="flex justify-center mb-[24px]">
              <div className="relative w-[300px] h-[300px] rounded-full overflow-hidden">
                <img
                  src="/Astrology.gif"
                  alt="Astrology Icon"
                  className="w-full h-full object-cover bg-white animate-spin"
                  style={{ animationDuration: "20s", animationDirection: "reverse" }}
                />
              </div>
            </div>
            <h1 className="text-[32px] font-semibold tracking-[3.2px] text-[#F2FF00] mb-[16px]">
              Tra cứu Chiêm tinh học
            </h1>
            <p className="text-[14px] font-semibold tracking-[1.4px] text-[#F2FF00] opacity-[0.9]">
            Chiêm tinh học mở ra hành trình khám phá bản thân qua bản đồ sao cá nhân, tiết lộ tiềm năng, thử thách và sự tương hợp trong cuộc đời.
            </p>
          </header>

          <AstrologyForm />
        </div>
      </main>
    </div>
  );
};

export default AstrologyCalculator;