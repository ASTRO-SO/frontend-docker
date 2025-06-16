import React from "react";

const FormInput = ({ type, value, onChange, placeholder }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="bg-[#131114] rounded-[10px] p-[20px] border-[1px] border-[#2D2C2E] outline-none w-full"
    />
  );
};

export default FormInput;
