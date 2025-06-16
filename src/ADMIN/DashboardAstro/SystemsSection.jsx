import React from "react";
import SystemCard from "./SystemCard";

function SystemsSection({ systems, onToggleActive, onEditSystem, onAddModel }) {
  return (
    <section className="grid grid-cols-1 gap-6 max-sm:grid-cols-1">
        <button className="p-8 flex-end border-1 border-solid border-white" onClick={() => onAddModel(true)}
        >
          + Add new planet
        </button>
      {systems.map((system) => (
        <SystemCard
          key={system.id}
          system={system}
          onToggleActive={onToggleActive}
          onEditSystem={onEditSystem}
        />
      ))}
    </section>
  );
}

export default SystemsSection;
