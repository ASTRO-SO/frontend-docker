import React from "react";
import { TabSection } from "./TabSection";

export const MainContent = ({ activeTab, setActiveTab }) => {
  return (
    <main className="w-full max-w-[1380px] mx-auto px-6 py-12 bg-[#47353E] rounded-[8px] mt-8">
      <h1 className="text-[33px] font-semibold tracking-[3.3px] text-center mb-8">
        GIỚI THIỆU VỀ THẦN SỐ HỌC VÀ CHIÊM TINH HỌC
      </h1>
      <p className="text-[21px] text-center mb-12 leading-[26px] tracking-[2.1px]">
        Chiêm tinh học và thần số học đều là những lĩnh vực thú vị liên quan đến
        việc tìm hiểu bản chất và vận mệnh của con người thông qua các yếu tố
        đặc biệt.
      </p>

      <TabSection activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex justify-center mb-12">
      <video
            src="/video1.mp4" // Replace with your video source for video1
            autoPlay
            loop
            muted
            className="w-[870px] h-[483px] rounded-[8px] object-cover"
          />

      </div>

      <div className="text-center">
        <p className="text-[21px] leading-[26px] tracking-[2.1px] mb-8">
          🌟 Chào mừng đến với ASTRO SỐ! 🌟
        </p>
        <p className="text-[21px] leading-[26px] tracking-[2.1px]">
          Hãy khám phá thế giới kỳ diệu của Thần số học và Chiêm tinh học, nơi
          bạn có thể tìm hiểu sâu hơn về bản thân và hành trình cuộc sống. Từ
          những con số mang năng lượng đặc biệt đến các cung hoàng đạo đầy bí
          ẩn, mọi thứ ở đây đều được thiết kế để mang lại cho bạn sự thấu hiểu
          và cảm hứng. Cùng bắt đầu hành trình khám phá chính mình ngay hôm nay!
          💫
        </p>
      </div>
    </main>
  );
};
