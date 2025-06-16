import React from "react";

const LoginButton = ({ isSubmitting }) => {
  return (
    <button
      type="submit"
      className="px-12 py-5 mx-auto mt-8 text-lg font-bold tracking-widest bg-transparent rounded-full border border-stone-400 border-opacity-50 w-[250px]"
      style={{
        background: isSubmitting ? "#666" : undefined,
      }}
      disabled={isSubmitting}
    >
      {isSubmitting ? "Processing..." : "Login"}
    </button>
  );
};

export default LoginButton;
