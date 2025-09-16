// path: src/components/templates/slides/DescriptionSlide.tsx

import React from "react";

interface DescriptionSlideProps {
  description: string;
}

export const DescriptionSlide: React.FC<DescriptionSlideProps> = ({ description }) => {
  return (
    <div className="bg-white/5 p-4 rounded-xl mb-4 border border-white/10 backdrop-blur">
      <h2 className="text-md font-semibold mb-2 text-foreground">Описание</h2>
      <p className="text-sm text-foreground/80 whitespace-pre-line">
        {description}
      </p>
    </div>
  );
};
