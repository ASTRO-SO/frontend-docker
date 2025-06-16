import React from "react";

function TabNavigation({ activeSection, setActiveSection }) {
  const tabs = [
    { id: "systems", label: "Systems" },
    { id: "meanings", label: "Meanings" },
  ];

  return (
    <nav className="flex gap-4 px-8 pb-8 border-b border-zinc-700">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className="px-5 py-2.5 font-medium rounded-lg"
          onClick={() => setActiveSection(tab.id)}
          style={{
            background: activeSection === tab.id ? "#372d45" : "transparent",
          }}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}

export default TabNavigation;
