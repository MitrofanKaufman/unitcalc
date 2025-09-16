// path: src/components/pages/ProductDetails.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductDetailsTemplate from '@template/ProductDetailsTemplate';
import type { ProductInfo } from "@core/types/product.ts";

interface SellerInfo {
  name?: string | null;
  type?: string;
  rating?: number | null;
  reviewCount?: number;
  location?: {
    city?: string | null;
    region?: string | null;
    country?: string | null;
  };
}

interface ApiResponse {
  product: ProductInfo;
  seller?: SellerInfo | null;
}

// Чтение локального JSON из папки public/product/{id}.json
const readLocalProductJson = async (id: string): Promise<ApiResponse | null> => {
  try {
    const response = await fetch(`/product/${id}.json`);
    console.log("[Fetch]", response.status, response.url);
    if (!response.ok) throw new Error("Not found");

    const json = await response.json();
    console.log("[Fetched JSON]", json);
    return json as ApiResponse;
  } catch (error) {
    console.error("[Fetch Error]", error);
    return null;
  }
};

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [productData, setProductData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(isDarkMode);
    if (isDarkMode) document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      setLoading(true);

      const data = await readLocalProductJson(id);
      setProductData(data);
      setLoading(false);
    };

    loadProduct();
  }, [id]);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  };

  const goBack = () => navigate(-1);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-foreground">
        Загрузка...
      </div>
    );
  }

  if (!productData || !productData.product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-foreground p-4">
        <p className="mb-4 text-xl">Данные о товаре с ID "{id}" не найдены.</p>
        <button
          className="btn btn-primary mb-4"
          onClick={() => alert("🔎 Запросить сбор данных...")}
        >
          Предложить сбор данных
        </button>
        <button onClick="/search" className="btn btn-secondary" type="button">
          Назад
        </button>
      </div>
    );
  }

  return (
    <ProductDetailsTemplate
      product={productData.product}
      seller={productData.seller ?? null}
      isDark={isDark}
      toggleTheme={toggleTheme}
      goBack={goBack}
    />
  );
};

export default ProductDetails;
