import React from "react";

function HouseSection() {
  // Create an array of 12 houses
  const houses = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <section className="p-6 rounded-xl border bg-zinc-800 border-zinc-700">
      <div className="grid grid-cols-4 gap-6 max-sm:grid-cols-1">
        {houses.map((houseNumber) => (
          <article
            key={houseNumber}
            className="p-5 bg-gray-900 rounded-lg border border-zinc-700"
          >
            <h4 className="mb-3 text-base font-medium text-white">
              House {houseNumber}
            </h4>
            <p className="text-sm text-gray-400">
              Life area and significance. Click to edit meanings and
              correspondences.
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default HouseSection;
