import React from "react";
import { motion } from "framer-motion";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

import BaseTemplate from "@template/BaseTemplate";
import { AvailabilitySlide } from "@template/slides/AvailabilitySlide";
import { CharacteristicsSlide } from "@template/slides/CharacteristicsSlide";
import { DescriptionSlide } from "@template/slides/DescriptionSlide";
import { ProductInfoSlide } from "@template/slides/ProductInfoSlide";
import { SellerSlide } from "@template/slides/SellerSlide";

interface ProductDetailsTemplateProps {
  product: {
    image: string;
    name: string;
    price: string;
    rating?: number;
    reviewCount?: number;
    description?: string;
    parameters?: Record<string, unknown>;
    availability?: unknown;
  };
  seller?: unknown;
  isDark: boolean;
  goBack: () => void;
  toggleTheme: () => void;
}

const ProductDetailsTemplate: React.FC<ProductDetailsTemplateProps> = ({
                                                                         product,
                                                                         seller,
                                                                         isDark,
                                                                         goBack,
                                                                         toggleTheme,
                                                                       }) => {
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: false,
    mode: "snap",
    slides: { perView: 1, spacing: 15 },
  });

  const slides = [
    product.description && (
      <DescriptionSlide key="desc" description={product.description} />
    ),
    product.parameters && Object.keys(product.parameters).length > 0 && (
      <CharacteristicsSlide key="char" parameters={product.parameters} />
    ),
    product.availability && (
      <AvailabilitySlide key="avail" availability={product.availability} />
    ),
    seller && <SellerSlide key="seller" seller={seller} />,
  ].filter(Boolean);

  return (
    <BaseTemplate
      title="О товаре"
      isDark={isDark}
      onBack={goBack}
      onToggleTheme={toggleTheme}
      actions={
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <svg
            className="w-5 h-5 text-primary opacity-60"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>
      }
    >
      <div className="max-w-md mx-auto" style={{ minWidth: 465 }}>
        <ProductInfoSlide
          image={product.image}
          title={product.name}
          price={product.price}
          rating={product.rating ?? 0}
          reviewCount={product.reviewCount ?? 0}
        />

        {/* Слайдер + описание/характеристики/наличие/продавец */}
        <div
          ref={sliderRef}
          className="relative group"
        >
          <div className="keen-slider">
            {slides.map((slide, idx) => (
              <div key={idx} className="keen-slider__slide">
                {slide}
              </div>
            ))}
          </div>

          {/* Prev (появляется при наведении, скрыт на мобильных) */}
          <button
            onClick={() => instanceRef.current?.prev()}
            aria-label="Предыдущий слайд"
            className="
              hidden md:flex
              absolute left-2 top-1/2 transform -translate-y-1/2 -translate-x-1/2
              items-center justify-center
              w-10 h-10 rounded-full
              glass-button text-foreground hover:text-primary
              opacity-0 group-hover:opacity-100 transition-opacity
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
          </button>

          {/* Next */}
          <button
            onClick={() => instanceRef.current?.next()}
            aria-label="Следующий слайд"
            className="
              hidden md:flex
              absolute right-2 top-1/2 transform -translate-y-1/2 translate-x-1/2
              items-center justify-center
              w-10 h-10 rounded-full
              glass-button text-foreground hover:text-primary
              opacity-0 group-hover:opacity-100 transition-opacity
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="m12 5 7 7-7 7" />
              <path d="M5 12h14" />
            </svg>
          </button>
        </div>
      </div>
    </BaseTemplate>
  );
};

export default ProductDetailsTemplate;
