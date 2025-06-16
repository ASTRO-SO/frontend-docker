import React from "react";

const ErrorMessage = ({ error }) => {
  if (!error) return null;

  return (
    <div className="bg-[#FFF3F3] border-l-[4px] border-[#FF4444] p-[12px] mt-[8px]">
      <p className="text-[#FF4444] text-[14px]">{error}</p>
    </div>
  );
};

export default ErrorMessage;
