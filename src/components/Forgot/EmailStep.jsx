import React from "react";

const EmailStep = ({ email, setEmail, onSubmit, isLoading }) => {
  return (
    <div>
      <p className="text-[14px] text-black mb-[24px]">
        Nhập địa chỉ email đã đăng ký để nhận mã xác thực
      </p>
      <div className="flex flex-col gap-[8px]">
        <label htmlFor="email" className="text-[14px] text-black font-semibold">
          Địa chỉ email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-[16px] py-[12px] rounded-[4px] text-black border-[1px] border-[#872472] focus:outline-none bg-[#FFF]"
          placeholder="Nhập địa chỉ email của bạn"
          disabled={isLoading}
        />
      </div>
      <button
        onClick={onSubmit}
        disabled={isLoading}
        className="w-full px-[24px] py-[12px] bg-[#CCA508] text-[#FFF] rounded-[4px] font-semibold mt-[24px] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Đang gửi..." : "Gửi mã xác thực"}
      </button>
    </div>
  );
};

export default EmailStep;