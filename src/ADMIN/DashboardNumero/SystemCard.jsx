import React from "react";
import ToggleSwitch from "./ToggleSwitch";

function SystemCard({ system, onToggleActive, onEditSystem }) {
  return (
    <article className="p-6 rounded-xl border bg-zinc-800 border-zinc-700">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="mb-2 text-xl font-semibold text-white">
            {system.name}
          </h3>
          <p className="mb-3 text-sm text-gray-400">{system.description}</p>
        </div>
        <div className="flex gap-4 items-center">
          <button
            className="p-2 text-indigo-700"
            onClick={() => onEditSystem(system)}
          >
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}

export default SystemCard;
