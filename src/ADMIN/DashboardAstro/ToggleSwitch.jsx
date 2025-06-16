import React from "react";

function ToggleSwitch({ isActive, onChange }) {
  return (
    <div className="inline-block relative w-11 h-6">
      <input
        type="checkbox"
        className="sr-only overflow-hidden absolute p-0 -m-px w-px h-px whitespace-nowrap"
        checked={isActive}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div
        className="w-11 h-6 rounded-full duration-200 ease-in-out"
        style={{
          background: isActive ? "#4318D1" : "#372d45",
        }}
      />
      <div
        className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out"
        style={{
          transform: isActive ? "translateX(20px)" : "translateX(0)",
        }}
      />
    </div>
  );
}

export default ToggleSwitch;
