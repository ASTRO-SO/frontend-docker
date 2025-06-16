import React from "react";

const FormHeader = () => {
  return (
    <header className="mb-12">
      <div className="flex items-center justify-center gap-[20px] mb-8">
        <img
          src="/AstroIcon.png"
          alt="Logo"
          className="h-[80px]"
        />
        <h1 className="text-[33px] font-semibold tracking-[3.3px]">ASTRO SỐ</h1>
      </div>
      <h2 className="text-[24px] font-semibold text-center tracking-[2.4px] mb-4">
        Sign Up New Account
      </h2>
      <p className="text-[#B7B5B5] text-center text-[18px]">
        Create an account to access full features
      </p>
    </header>
  );
};

export default FormHeader;
