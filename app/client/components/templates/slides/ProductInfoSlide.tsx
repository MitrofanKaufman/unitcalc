// path: src/components/templates/slides/ProductInfoSlide.tsx

import { Star } from "lucide-react";
import React from "react";

interface ProductInfoSlideProps {
  image: string;
  name: string;
  price: number;
  rating?: number;
  reviewCount?: number;
}

export const ProductInfoSlide: React.FC<ProductInfoSlideProps> = ({
                                                                    image,
                                                                    name,
                                                                    price,
                                                                    rating,
                                                                    reviewCount,
                                                                  }) => {
  return (
    <div className="relative rounded-2xl overflow-hidden h-64 mb-6 shadow-md border border-white/10">
      {/* Фоновое изображение */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      />

      {/* Затемнение снизу */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      {/* Контент поверх */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10">
        <h2 className="text-lg font-semibold leading-tight">{name}</h2>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xl font-bold">{price.toLocaleString()} ₽</span>
          {rating !== undefined && (
            <div className="flex items-center gap-1 text-yellow-400 text-sm">
              <Star className="w-4 h-4 fill-yellow-400" />
              {rating.toFixed(1)}{" "}
              <span className="text-white/70">({reviewCount ?? 0})</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
