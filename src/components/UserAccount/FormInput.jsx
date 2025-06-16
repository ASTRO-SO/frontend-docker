import React from "react";

const FormInput = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  helpText,
}) => {
  return (
    <div className="flex flex-col gap-[8px]">
      <label className="text-[14px] font-semibold">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full px-[16px] py-[12px] rounded-[4px] border-[1px] border-[#872472] focus:outline-none bg-[#FFF]"
        placeholder={placeholder}
      />
      {helpText && (
        <p className="text-[12px] text-[#666] mt-[4px]">{helpText}</p>
      )}
    </div>
  );
};

export default FormInput;
