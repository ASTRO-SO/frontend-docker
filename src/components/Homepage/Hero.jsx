import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();
  const [statistics, setStatistics] = useState({
    totalReadings: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/users/statistics');
        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }
        const data = await response.json();
        setStatistics({
          totalReadings: data.totalReadings,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Error fetching statistics:', error);
        setStatistics({
          totalReadings: 0,
          loading: false,
          error: error.message
        });
      }
    };

    fetchStatistics();
  }, []);

  const handleNavigateToIntroduction = () => {
    navigate('/introduction');
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M+';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K+';
    }
    return num.toLocaleString() + '+';
  };

  return (
    <section className="z-10 mt-0 w-full bg-[url('/BGmain.jpg')] max-md:max-w-full">
      <div className="flex gap-5 max-md:flex-col">
        <div className="w-[37%] max-md:ml-0 max-md:w-full">
          <div className="flex relative flex-col grow justify-center items-start px-20 min-h-[1049px] py-[521px] rounded-[360px] max-md:px-5 max-md:py-24 max-md:max-w-full">
            <img
              src="/NSTT.png"
              alt="Background"
              className="object-cover absolute inset-0 size-full"
            />
          </div>
        </div>
        <div className="ml-5 w-[63%] max-md:ml-0 max-md:w-full">
          <div className="flex flex-col items-center mt-32 w-full max-md:mt-10 max-md:max-w-full">
            <h2 className="text-5xl font-black text-center text-fuchsia-700 leading-[64px] tracking-[4.8px] max-md:max-w-full max-md:text-4xl max-md:leading-[60px]">
              TRA CỨU THẦN SỐ HỌC VÀ CHIÊM TINH HỌC
            </h2>
            <p className="self-stretch mt-2 ml-6 text-2xl font-medium leading-10 text-center text-pink-50 border border-black border-none tracking-[2.4px] max-md:max-w-full">
              Khám Phá Đường Đời Của Bạn Qua Thần Số Học Và Chiêm Tinh Học Cùng
              Chúng Tôi
            </p>
            <p className="mt-3.5 text-xl font-medium leading-8 text-center text-white tracking-[2.1px] max-md:max-w-full">
              Tra cứu thần số học và chiêm tinh học để hiểu rõ hơn về bản thân,
              tương lai và mối quan hệ của bạn
            </p>

            <div className="self-start px-5 pt-14 pb-3 mt-14 max-w-full w-[874px] max-md:px-5 max-md:mt-10">
              <div className="flex gap-5 max-md:flex-col justify-center">
                <div className="w-[46%] max-md:ml-0 max-md:w-full">
                  <div className="flex flex-col items-center text-center max-md:mt-10">
                    <div className="text-5xl font-black leading-none text-fuchsia-700 tracking-[4.3px]">
                      {statistics.loading ? (
                        <span className="animate-pulse">Loading...</span>
                      ) : statistics.error ? (
                        "23.322+"
                      ) : (
                        formatNumber(statistics.totalReadings)
                      )}
                    </div>
                    <div className="self-stretch mt-9 text-3xl leading-none text-white tracking-[3.2px]">
                      LƯỢT TRA CỨU
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={handleNavigateToIntroduction}
              className="flex mt-14 max-w-full text-2xl font-extrabold leading-none text-center text-white tracking-[2.4px] w-[696px] max-md:mt-10 hover:bg-fuchsia-900 transition-colors duration-200 cursor-pointer"
            >
              <div className="flex flex-auto py-5 gap-5 mx-auto bg-fuchsia-800 w-full">
                <span className="flex-wrap flex-auto gap-px my-auto ml-auto max-md:max-w-full">
                  TRA CỨU CÁC CHỈ SỐ CỦA BẠN NGAY &gt;
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};