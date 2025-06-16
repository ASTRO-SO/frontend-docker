import React from "react";

/**
 * Stats card component for displaying metrics
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {number|string} props.value - Value to display
 */
function StatsCard({ title, value }) {
  return (
    <article className="p-6 rounded-xl border bg-zinc-800 border-zinc-700">
      <h3 className="mb-2 text-sm font-medium text-gray-400">{title}</h3>
      <p className="text-3xl font-semibold text-white">{value}</p>
    </article>
  );
}

export default StatsCard;
