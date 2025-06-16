import React from "react";
import PlanetCard from "./PlanetCard";

function PlanetSection({ planets, onEditItem }) {
  return (
    <div className="grid grid-cols-3 gap-6 max-sm:grid-cols-1">
      {planets?.map((planet) => (
        <PlanetCard key={planet.id} planet={planet} onEdit={onEditItem} />
      ))}
    </div>
  );
}

export default PlanetSection;
