import React from "react";
import ZodiacCard from "./ZodiacCard";

function ZodiacSection({ zodiacSigns, onEditItem }) {
  return (
    <div className="grid grid-cols-2 gap-6 max-sm:grid-cols-1">
      {zodiacSigns?.map((sign) => (
        <ZodiacCard key={sign.id} sign={sign} onEdit={onEditItem} />
      ))}
    </div>
  );
}

export default ZodiacSection;
