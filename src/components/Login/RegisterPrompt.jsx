import React from "react";

const RegisterPrompt = () => {
  return (
    <div className="flex gap-4 items-center mt-16">
      <span className="text-lg font-semibold tracking-widest text-amber-400">
        Don't have an account?
      </span>
      <a
        href="/signup"
        className="text-lg font-bold tracking-widest"
      >
        Register now
      </a>
    </div>
  );
};

export default RegisterPrompt;
