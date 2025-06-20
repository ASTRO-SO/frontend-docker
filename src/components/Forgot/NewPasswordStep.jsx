import React from "react";

const NewPasswordStep = ({
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  onBack,
  onSubmit,
}) => {
  return (
    <div>
      <p className="text-[14px] text-[#666] mb-[24px]">
        Tạo mật khẩu mới cho tài khoản của bạn
      </p>
      <div className="flex flex-col gap-[24px]">
        <div className="flex flex-col gap-[8px]">
          <label htmlFor="newPassword" className="text-[14px] text-black font-semibold">
            Mật khẩu mới
          </label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-[16px] text-black py-[12px] rounded-[4px] border-[1px] border-[#872472] focus:outline-none bg-[#FFF]"
            placeholder="Nhập mật khẩu mới"
          />
          <p className="text-[12px] text-[#666] mt-[4px]">
            Mật khẩu phải có ít nhất 8 ký tự
          </p>
        </div>
        <div className="flex flex-col gap-[8px]">
          <label
            htmlFor="confirmPassword"
            className="text-[14px] text-black font-semibold"
          >
            Xác nhận mật khẩu mới
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-[16px] text-black py-[12px] rounded-[4px] border-[1px] border-[#872472] focus:outline-none bg-[#FFF]"
            placeholder="Xác nhận mật khẩu mới"
          />
        </div>
      </div>
      <div className="flex gap-[12px] mt-[24px]">
        <button
          onClick={onBack}
          className="flex-1 px-[24px] py-[12px] bg-[#F5F5F5] text-[#242108] rounded-[4px] font-semibold"
        >
          Quay lại
        </button>
        <button
          onClick={onSubmit}
          className="flex-1 px-[24px] py-[12px] bg-[#CCA508] text-[#FFF] rounded-[4px] font-semibold"
        >
          Đổi mật khẩu
        </button>
      </div>
    </div>
  );
};

export default NewPasswordStep;