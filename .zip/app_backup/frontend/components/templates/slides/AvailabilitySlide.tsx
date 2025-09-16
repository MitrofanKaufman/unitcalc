// path: src/components/templates/slides/AvailabilitySlide.tsx

import React from "react";

interface WarehouseStock {
  warehouse: string;
  count: number;
}

interface AvailabilitySlideProps {
  availability: WarehouseStock[]; // Пример: [{ warehouse: 'Москва', count: 24 }]
}

export const AvailabilitySlide: React.FC<AvailabilitySlideProps> = ({ availability }) => {
  if (!availability.length) return null;

  return (
    <div className="bg-white/5 p-4 rounded-xl mb-4 border border-white/10 backdrop-blur">
      <h2 className="text-md font-semibold mb-2 text-foreground">Наличие</h2>
      <ul className="text-sm text-foreground/80 space-y-1">
        {availability.map((item, idx) => (
          <li key={idx}>
            <span className="font-medium">{item.warehouse}:</span> {item.count} шт.
          </li>
        ))}
      </ul>
    </div>
  );
};
