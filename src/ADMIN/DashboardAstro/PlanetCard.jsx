import React from "react";
import EditButton from "./EditButton";

function PlanetCard({ planet, onEdit }) {
  return (
    <article className="p-6 rounded-xl border bg-zinc-800 border-zinc-700">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <header className="flex gap-3 items-center mb-4">
            <span className="text-3xl" aria-hidden="true">
              {planet.symbol}
            </span>
            <h3 className="text-xl font-semibold text-white">{planet.name}</h3>
          </header>

          <p className="mb-3 text-sm text-gray-400">{planet.meaning}</p>

          <div className="p-3 bg-gray-900 rounded-lg">
            <span className="text-xs text-gray-400">Domicile</span>
            <p className="text-sm font-medium text-white">{planet.domicile}</p>
          </div>
        </div>

        <EditButton onEdit={() => onEdit(planet)} />
      </div>
    </article>
  );
}

export default PlanetCard;
