import React from "react";
import SystemCard from "./SystemCard";

function SystemsSection({ systems, onToggleActive, onEditSystem, onAddModel }) {
  return (
    <section className="grid grid-cols-1 gap-6 max-sm:grid-cols-1">
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
