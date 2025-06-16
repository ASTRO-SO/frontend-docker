import React from "react";
import AspectCard from "./AspectCard";

function AspectSection({ aspects, onEditItem }) {
  return (
    <div className="grid grid-cols-2 gap-6 max-sm:grid-cols-1">
      {aspects?.map((aspect) => (
        <AspectCard key={aspect.id} aspect={aspect} onEdit={onEditItem} />
      ))}
    </div>
  );
}

export default AspectSection;
