// path: src/components/templates/slides/SellerSlide.tsx

import { MapPin, Star } from "lucide-react";
import React from "react";

interface SellerLocation {
  city?: string | null;
  region?: string | null;
  country?: string | null;
}

interface SellerInfo {
  name?: string | null;
  type?: string;
  rating?: number | null;
  reviewCount?: number;
  location?: SellerLocation;
}

interface SellerSlideProps {
  seller: SellerInfo;
}

export const SellerSlide: React.FC<SellerSlideProps> = ({ seller }) => {
  const {
    name = "Неизвестный продавец",
    type,
    rating,
    reviewCount,
    location,
  } = seller;

  const locationText = [location?.city, location?.region, location?.country]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="bg-white/5 p-4 rounded-xl mb-4 border border-white/10 backdrop-blur">
      <h2 className="text-md font-semibold mb-2 text-foreground">Продавец</h2>
      <div className="text-sm text-foreground/80">
        <p className="mb-1"><strong>Имя:</strong> {name}</p>
        {type && <p className="mb-1"><strong>Тип:</strong> {type}</p>}
        {(rating || reviewCount) && (
          <p className="mb-1 flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400" />
            <span>{rating?.toFixed(1) ?? "?"} ({reviewCount ?? 0} отзывов)</span>
          </p>
        )}
        {locationText && (
          <p className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-400" />
            <span>{locationText}</span>
          </p>
        )}
      </div>
    </div>
  );
};
