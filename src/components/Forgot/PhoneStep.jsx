import React from "react";

const PhoneStep = ({ phone, setPhone, onSubmit }) => {
  return (
    <div>
      <p className="text-[14px] text-black mb-[24px]">
        Nhập số điện thoại đã đăng ký để nhận mã xác thực
      </p>
      <div className="flex flex-col gap-[8px]">
        <label htmlFor="phone" className="text-[14px] text-black font-semibold">
          Số điện thoại
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-[16px] py-[12px] rounded-[4px] text-black border-[1px] border-[#872472] focus:outline-none bg-[#FFF]"
          placeholder="Nhập số điện thoại của bạn"
          pattern="[0-9]{10}"
        />
      </div>
      <button
        onClick={onSubmit}
        className="w-full px-[24px] py-[12px] bg-[#CCA508] text-[#FFF] rounded-[4px] font-semibold mt-[24px]"
      >
        Gửi mã xác thực
      </button>
    </div>
  );
};

export default PhoneStep;
