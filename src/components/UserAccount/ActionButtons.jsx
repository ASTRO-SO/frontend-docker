import React from "react";
import PropTypes from "prop-types";

const ActionButtons = ({ onChangePassword }) => {
  const handleLogout = () => {
    // Remove session state from localStorage
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    
    window.location.href = "/";
  };

  return (
    <div className="flex flex-col gap-[16px] mt-[32px] pt-[32px] border-t-[1px] border-[#E5E5E5]">
      <button
        onClick={onChangePassword}
        className="w-full px-[24px] py-[12px] bg-[#872472] text-[#FFF] rounded-[4px] font-semibold cursor-pointer"
      >
        Đổi mật khẩu
      </button>
      <button
        onClick={handleLogout}
        className="w-full px-[24px] py-[12px] bg-[#CCA508] text-[#FFF] rounded-[4px] font-semibold cursor-pointer"
      >
        Đăng xuất
      </button>
    </div>
  );
};

ActionButtons.propTypes = {
  onChangePassword: PropTypes.func.isRequired,
};

export default ActionButtons;