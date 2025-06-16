import React from "react";
import EditButton from "./EditButton";

function ZodiacCard({ sign, onEdit }) {
  return (
    <article className="p-6 rounded-xl border bg-zinc-800 border-zinc-700">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <header className="flex gap-3 items-center mb-4">
            <span className="text-3xl" aria-hidden="true">
              {sign.symbol}
            </span>
            <div>
              <h3 className="text-xl font-semibold text-white">{sign.name}</h3>
              <p className="text-sm text-gray-400">{sign.dateRange}</p>
            </div>
          </header>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 bg-gray-900 rounded-lg">
              <span className="text-xs text-gray-400">Element</span>
              <p className="text-sm font-medium text-white">{sign.element}</p>
            </div>
            <div className="p-3 bg-gray-900 rounded-lg">
              <span className="text-xs text-gray-400">Ruling Planet</span>
              <p className="text-sm font-medium text-white">{sign.planet}</p>
            </div>
          </div>

          <p className="mb-3 text-sm text-gray-400">{sign.description}</p>

          <div className="flex flex-wrap gap-2">
            {sign.traits?.map((trait, index) => (
              <span
                key={index}
                className="px-3 py-1 text-xs rounded-full bg-zinc-700"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>

        <EditButton onEdit={() => onEdit(sign)} />
      </div>
    </article>
  );
}

export default ZodiacCard;
