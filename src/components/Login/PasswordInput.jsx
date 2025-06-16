import React from "react";

const PasswordInput = ({ password, setPassword, error }) => {
  return (
    <div className="relative">
      <div className="p-4 rounded-xl border bg-neutral-900 border-stone-400">
        <input
          type="password"
          placeholder="Password"
          className="w-full bg-transparent"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? "password-error" : undefined}
        />
      </div>
      {error && (
        <p
          id="password-error"
          className="absolute left-0 text-sm leading-5 text-red-500"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default PasswordInput;
