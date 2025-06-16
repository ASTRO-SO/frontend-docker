import React from "react";

function CalculationsSection() {
  const calculationMethods = [
    {
      id: 1,
      title: "Basic Number Reduction",
      description: "Method to reduce multiple digits to a single number",
      example: "29 → 2 + 9 = 11 → 1 + 1 = 2",
    },
    {
      id: 2,
      title: "Letter to Number Conversion",
      description: "Converting letters to their numerical values",
      example: "A=1, B=2, C=3, ..., I=9",
    },
  ];

  return (
    <section className="p-6 rounded-xl border bg-zinc-800 border-zinc-700">
      <h2 className="mb-6 text-xl font-semibold text-white">
        Calculation Methods
      </h2>
      <div className="grid grid-cols-2 gap-6 max-sm:grid-cols-1">
        {calculationMethods.map((method) => (
          <article
            key={method.id}
            className="p-5 bg-gray-900 rounded-lg border border-zinc-700"
          >
            <h3 className="mb-3 text-base font-medium text-white">
              {method.title}
            </h3>
            <p className="mb-4 text-sm text-gray-400">{method.description}</p>
            <pre className="p-3 text-sm text-gray-200 rounded bg-neutral-900">
              {method.example}
            </pre>
          </article>
        ))}
      </div>
    </section>
  );
}

export default CalculationsSection;
