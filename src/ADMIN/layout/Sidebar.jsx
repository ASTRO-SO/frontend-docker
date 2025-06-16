import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * Sidebar navigation component
 * @param {Object} props - Component props
 * @param {string} props.activeTab - Currently active tab
 * @param {Function} props.setActiveTab - Function to set active tab
 */
function Sidebar({ activeTab, setActiveTab }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    {
      id: "users",
      label: "Users",
      path: "/admin",
      icon: (
        <svg
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
    {
      id: "numerology",
      label: "Numerology",
      path: "/admin-numerology",
      icon: (
        <svg
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      id: "astrology",
      label: "Astrology",
      path: "/admin-astrology",
      icon: (
        <svg
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
      ),
    },
    {
      id: "readings",
      label: "Readings",
      path: "/admin-reading",
      icon: (
        <svg
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
{
      id: "contact",
      label: "(Unused content)",
      path: "/admin-contact",
      icon: (
        <svg
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },

  ];

  // Update active tab based on current location
  useEffect(() => {
    // Find the nav item matching the current path
    const currentNavItem = navItems.find(item => location.pathname === item.path);
    if (currentNavItem && currentNavItem.id !== activeTab) {
      setActiveTab(currentNavItem.id);
    }
  }, [location.pathname, activeTab, setActiveTab, navItems]);

  const handleNavigation = (item) => {
    setActiveTab(item.id);
    navigate(item.path);
  };

  return (
    <nav className="flex overflow-y-auto flex-col p-6 text-gray-200 border bg-zinc-800 border-zinc-700 w-64">
      <div className="flex gap-3 items-center mb-12">
        <img
          src="/AstroIcon.png"
          alt="Logo"
          className="rounded-lg h-15"
        />
        <h1 className="text-2xl font-semibold text-white">Astro Admin</h1>
      </div>

      <div className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isDisabled = item.id === '' || item.id === 'contact';
          
          return (
            <button
              key={item.id}
              disabled={isDisabled}
              className={`flex gap-3 items-center p-3 text-base font-medium rounded-lg transition-colors ${
                isDisabled 
                  ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" 
                  : `hover:bg-zinc-700 ${activeTab === item.id ? "bg-purple-900/40" : ""}`
              }`}
              onClick={() => !isDisabled && handleNavigation(item)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default Sidebar;