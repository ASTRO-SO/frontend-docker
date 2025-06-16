"use client";
import React, { useState } from "react";
import { useAuth } from "../../AuthProvider";
import NotificationsMenu from "./NotificationsMenu";

/**
 * Header component with title and user controls
 * @param {Object} props - Component props
 * @param {string} props.activeTab - Currently active tab
 * @param {Array} props.notifications - Notifications to display
 */
function Header({ activeTab, notifications }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { logout, userRole } = useAuth(); // Get logout function and user role

  // Capitalize the first letter of the active tab for display
  const formattedTitle = activeTab.charAt(0).toUpperCase() + activeTab.slice(1);

  const handleLogout = () => {
    logout();
    setProfileMenuOpen(false);
  };

  return (
    <header className="flex justify-between items-center p-6 border bg-zinc-800 border-zinc-700">
      <div className="flex gap-4 items-center">
        <h2 className="text-2xl font-semibold text-white">{formattedTitle}</h2>
      </div>

      <div className="flex gap-6 items-center">

        <div className="relative">
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="flex items-center gap-2 hover:bg-zinc-700 rounded-lg p-2 transition-colors"
            aria-label="User menu"
            aria-expanded={profileMenuOpen}
          >
            <img
              src="https://placehold.co/32x32"
              alt="Profile"
              className="rounded-full"
            />
            {userRole && (
              <span className="text-sm text-gray-300 capitalize">{userRole}</span>
            )}
            <svg
              className={`w-4 h-4 text-gray-300 transition-transform ${
                profileMenuOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {profileMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-48 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg z-50"
              role="menu"
            >
              <div className="py-1">
                <div className="px-4 py-2 text-sm text-gray-300 border-b border-zinc-700">
                  <div className="font-medium">User Profile</div>
                  {userRole && (
                    <div className="text-xs text-gray-400 capitalize">Role: {userRole}</div>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-zinc-700 transition-colors flex items-center gap-2"
                  role="menuitem"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Click outside to close profile menu */}
        {profileMenuOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setProfileMenuOpen(false)}
          />
        )}
      </div>
    </header>
  );
}

export default Header;