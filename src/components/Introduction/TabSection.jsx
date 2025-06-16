import React from "react";

export const TabSection = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex gap-[32px] mb-12">
      <div
        onClick={() => setActiveTab("numerology")}
        style={{
          background: activeTab === "numerology" ? "#872472" : "#333333",
          color: activeTab === "numerology" ? "#ffffff" : "#333333",
        }}
        className="flex-1 p-6 rounded-[8px] cursor-pointer transition-all duration-300"
      >
        <h2 className="text-[24px] font-semibold mb-4">Thần Số Học</h2>
        <p className="text-[16px] leading-[24px]">
          Thần số học là nghệ thuật khám phá ý nghĩa sâu xa của các con số trong
          cuộc sống. Mỗi con số đều mang những rung động năng lượng riêng, ảnh
          hưởng đến tính cách và số phận của mỗi người.
        </p>
      </div>
      <div
        onClick={() => setActiveTab("astrology")}
        style={{
          background: activeTab === "astrology" ? "#872472" : "#333333",
          color: activeTab === "astrology" ? "#ffffff" : "#333333",
        }}
        className="flex-1 p-6 rounded-[8px] cursor-pointer transition-all duration-300"
      >
        <h2 className="text-[24px] font-semibold mb-4">Chiêm Tinh Học</h2>
        <p className="text-[16px] leading-[24px]">
          Chiêm tinh học nghiên cứu mối quan hệ giữa vị trí của các thiên thể và
          ảnh hưởng của chúng đến cuộc sống con người. Thông qua bản đồ sao, ta
          có thể hiểu rõ hơn về tính cách và định mệnh.
        </p>
      </div>
    </div>
  );
};
