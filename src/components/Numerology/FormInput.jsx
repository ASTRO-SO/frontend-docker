"use client";
import React from "react";

const FormInput = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  min,
  max,
  options,
}) => {
  const inputClasses =
    "w-full h-[40px] px-[16px] bg-[#000] rounded-[4px] text-[14px] tracking-[1.4px] placeholder-[#ACAAAA] focus:outline-none focus:ring-2 focus:ring-[#A81B8C]";

  if (type === "select") {
    return (
      <div className="space-y-[8px]">
        <label className="text-[14px] font-bold tracking-[1.4px]">
          {label}
        </label>
        <select value={value} onChange={onChange} className={inputClasses}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="space-y-[8px]">
      <label className="text-[14px] font-bold tracking-[1.4px]">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        className={inputClasses}
      />
    </div>
  );
};

export default FormInput;
