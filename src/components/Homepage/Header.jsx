"use client";
import React, { useState, useEffect } from "react";
import UserAccount from "../UserAccount/UserAccount";
import PasswordChange from "../UserAccount/PasswordChange";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthProvider"; // Import the useAuth hook

export const Header = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth(); // Use the auth context
  const [showUserAccount, setShowUserAccount] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  // Close the modal when clicking the overlay.
  const closeModal = () => {
    setShowUserAccount(false);
    setShowPasswordChange(false);
  };

  // Handle logout using the context
  const handleLogout = () => {
    logout(); // Use the context's logout function
    setShowUserAccount(false);
  };

  // Handle switching to password change screen
  const handleChangePassword = () => {
    setShowPasswordChange(true);
    setShowUserAccount(false);
  };

  // Handle going back to user account from password change
  const handleBackToAccount = () => {
    setShowPasswordChange(false);
    setShowUserAccount(true);
  };

  // Handle navigation with auth check
  const handleNavigation = (path) => (e) => {
    // Prevent default link behavior
    e.preventDefault();
    
    // Check if the path requires authentication
    if ((path === "/numerology" || path === "/astrology") && !isLoggedIn) {
      navigate("/signup");
    } else {
      navigate(path);
    }
  };

  // Log the authentication state whenever it changes
  useEffect(() => {
    console.log("Header - Auth state changed:", { isLoggedIn });
  }, [isLoggedIn]);

  return (
    <>
      <header className="flex flex-wrap gap-5 justify-between items-start pr-4 w-full font-semibold text-center bg-fuchsia-900 max-md:max-w-full">
        <div className="flex my-auto text-3xl leading-loose text-fuchsia-50 tracking-[3.2px]">
          <img
            src="/AstroIcon.png"
            alt="Astro Logo"
            className="object-contain shrink-0 ml-auto max-w-full aspect-[1.51] w-[101px]"
          />
          <h1 className="self-start border border-none basis-auto">ASTRO SỐ</h1>
        </div>
        <nav className="flex gap-3 items-start my-auto text-xl leading-3 text-white tracking-[2px] max-md:max-w-full">
          <div className="flex gap-4">
            <a href="/" onClick={handleNavigation("/")} className="">
              Home
            </a>
            <a href="/introduction" onClick={handleNavigation("/introduction")} className="">
              Giới thiệu
            </a>
            <a href="/numerology" onClick={handleNavigation("/numerology")} className="">
              Thần số học
            </a>
            <a href="/astrology" onClick={handleNavigation("/astrology")} className="">
              Chiêm tinh học
            </a>
            <a href="/guide" onClick={handleNavigation("/guide")} className="">
              Hướng dẫn
            </a>
            {isLoggedIn ? (
              <button
                onClick={() => setShowUserAccount(true)}
                className="bg-transparent border-none text-white cursor-pointer hover:underline"
              >
                Tài khoản
              </button>
            ) : (
              <a href="/signup" onClick={handleNavigation("/signup")} className="">
                Đăng nhập
              </a>
            )}
          </div>
        </nav>
      </header>

      {/* Modal overlay for UserAccount or PasswordChange */}
      {(showUserAccount || showPasswordChange) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={closeModal}
        >
          {/* Clicks inside the modal are prevented from closing it */}
          <div
            className="bg-white p-6 rounded shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {showUserAccount && (
              <UserAccount 
                onChangePassword={handleChangePassword} 
                onLogout={handleLogout}
              />
            )}
            {showPasswordChange && (
              <PasswordChange onBack={handleBackToAccount} />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;