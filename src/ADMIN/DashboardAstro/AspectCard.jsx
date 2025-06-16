import React from "react";
import EditButton from "./EditButton";

function AspectCard({ aspect, onEdit }) {
  return (
    <article className="p-6 rounded-xl border bg-zinc-800 border-zinc-700">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <header className="flex gap-3 items-center mb-4">
            <span className="text-3xl" aria-hidden="true">
              {aspect.symbol}
            </span>
            <div>
              <h3 className="text-xl font-semibold text-white">
                {aspect.name}
              </h3>
              <p className="text-sm text-gray-400">{aspect.angle}</p>
            </div>
          </header>

          <div className="p-3 mb-3 bg-gray-900 rounded-lg">
            <span className="text-xs text-gray-400">Nature</span>
            <p className="text-sm font-medium text-white">{aspect.nature}</p>
          </div>
        </div>

        <EditButton onEdit={() => onEdit(aspect)} />
      </div>
    </article>
  );
}

export default AspectCard;
