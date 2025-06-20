import React from "react";

const VerificationStep = ({ code, setCode, onBack, onSubmit, onResend, isLoading }) => {
  return (
    <div>
      <p className="text-[14px] text-[#666] mb-[24px]">
        Mã xác thực đã được gửi đến email của bạn
      </p>
      <div className="flex flex-col gap-[8px]">
        <label htmlFor="code" className="text-[14px] text-black font-semibold">
          Mã xác thực
        </label>
        <input
          id="code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          maxLength="6"
          className="w-full px-[16px] py-[12px] text-black rounded-[4px] border-[1px] border-[#872472] focus:outline-none bg-[#FFF] text-center tracking-[8px] font-semibold"
          placeholder="000000"
          disabled={isLoading}
        />
      </div>
      <div className="flex justify-between items-center mt-[16px] mb-[24px]">
        <span className="text-[14px] text-[#666]">Chưa nhận được mã?</span>
        <button
          onClick={onResend}
          disabled={isLoading}
          className="text-[14px] text-[#872472] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Đang gửi..." : "Gửi lại mã"}
        </button>
      </div>
      <div className="flex gap-[12px]">
        <button
          onClick={onBack}
          disabled={isLoading}
          className="flex-1 px-[24px] py-[12px] bg-[#F5F5F5] text-[#242108] rounded-[4px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Quay lại
        </button>
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className="flex-1 px-[24px] py-[12px] bg-[#CCA508] text-[#FFF] rounded-[4px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Xác nhận
        </button>
      </div>
    </div>
  );
};

export default VerificationStep;