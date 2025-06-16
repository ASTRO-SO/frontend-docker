import React, { useState } from "react";
import ForgotPassword from '../Forgot/ForgotPassword';

const RememberForgot = ({ remember, setRemember }) => {
  const [showForgot, setShowForgot] = useState(false);

  const handleForgotClick = (e) => {
    e.preventDefault();
    setShowForgot(true);
  };

  return (
    <>
      <div className="flex justify-between items-center mt-4">
        <label className="flex gap-2 items-center cursor-pointer">
          <input
            type="checkbox"
            className="w-5 h-5 rounded bg-neutral-900 border-stone-400"
            checked={remember}
            onChange={(event) => setRemember(event.target.checked)}
          />
          <span className="text-base tracking-widest">Remember login</span>
        </label>
        <a
          href="#"
          className="text-base tracking-widest opacity-80"
          onClick={handleForgotClick}
        >
          Forgot password?
        </a>
      </div>

      {showForgot && (
        // Modal overlay that dims the background and listens for outside clicks
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowForgot(false)}
        >
          {/* Prevent clicks inside the modal from closing it */}
          <div onClick={(e) => e.stopPropagation()}>
            <ForgotPassword onClose={() => setShowForgot(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default RememberForgot;