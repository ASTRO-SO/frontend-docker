import React from "react";

const LoginHeader = () => {
  return (
    <header className="flex gap-4 items-center mb-12">
      <img src="/AstroIcon.png" alt="Logo" className="w-[131px]" />
      <div className="flex flex-col items-start">
        <h1 className="text-4xl font-bold tracking-[3.3px]">ASTRO SỐ</h1>
        <h2 className="text-2xl font-bold tracking-[2.4px]">Login</h2>
      </div>
    </header>
  );
};

export default LoginHeader;
