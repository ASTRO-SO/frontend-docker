import React from "react";
import PropTypes from "prop-types";

const FormField = ({
  label,
  value,
  type,
  placeholder,
  isEditing,
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-[8px]">
      <label className="text-[14px] font-semibold">{label}</label>
      {isEditing ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-[16px] py-[12px] rounded-[4px] border-[1px] border-[#872472] focus:outline-none bg-[#FFF]"
          placeholder={placeholder}
        />
      ) : (
        <span className="text-[16px] py-[8px]">{value}</span>
      )}
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  isEditing: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default FormField;
