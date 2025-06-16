import React from "react";

const PhoneInput = ({ phone, setPhone, error }) => {
  return (
    <div className="relative">
      <div className="flex items-center p-4 rounded-xl border bg-neutral-900 border-stone-400">
        <span className="flex gap-2 items-center">
          <img
            src="/image.png"
            alt="Flag"
            className="w-5 h-5"
          />
        </span>
        <input
          type="tel"
          placeholder="Phone number"
          className="ml-4 w-full bg-transparent"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? "phone-error" : undefined}
        />
      </div>
      {error && (
        <p
          id="phone-error"
          className="absolute left-0 text-sm leading-5 text-red-500"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default PhoneInput;
