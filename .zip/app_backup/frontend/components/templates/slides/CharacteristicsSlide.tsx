// path: src/components/templates/slides/CharacteristicsSlide.tsx

import React from "react";

interface CharacteristicsSlideProps {
  parameters: Record<string, string | number | boolean>;
}

export const CharacteristicsSlide: React.FC<CharacteristicsSlideProps> = ({ parameters }) => {
  return (
    <div className="bg-white/5 p-4 rounded-xl mb-4 border border-white/10 backdrop-blur">
      <h2 className="text-md font-semibold mb-2 text-foreground">Характеристики</h2>
      <ul className="text-sm text-foreground/80 space-y-1">
        {Object.entries(parameters).map(([key, value]) => (
          <li key={key}>
            <span className="font-medium">{key}:</span> {String(value)}
          </li>
        ))}
      </ul>
    </div>
  );
};
