"use client";
import React from "react";

const FormField = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  options = [],
  className = "",
  containerClassName = "",
}) => {
  const baseInputClass =
    "px-5 h-10 text-sm tracking-widest bg-black text-neutral-400";

  return (
    <div className={`flex flex-col gap-2.5 ${containerClassName}`}>
      {label && (
        <label className="text-sm font-bold tracking-widest text-white">
          {label}
        </label>
      )}
      {type === "select" ? (
        <select
          className={`${baseInputClass} ${className}`}
          value={value}
          onChange={onChange}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          className={`${baseInputClass} ${className}`}
          value={value}
          onChange={onChange}
        />
      )}
    </div>
  );
};

export default FormField;
