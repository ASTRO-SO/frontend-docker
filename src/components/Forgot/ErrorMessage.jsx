import React from "react";

const ErrorMessage = ({ message }) => {
  return (
    <div className="bg-[#FFF3F3] border-l-[4px] border-[#FF4444] p-[12px] mt-[16px]">
      <p className="text-[#FF4444] text-[14px]">{message}</p>
    </div>
  );
};

export default ErrorMessage;
