// path: src/components/pages/ProductDetails.tsx

/**
 * Компонент отображения подробной информации о товаре.
 * Загружает данные из location.state или с сервера по `/api/v1/product/:id`.
 * Поддерживает темную тему, parallax background, слайдер описания, характеристик и продавца.
 * Кнопка "Аналитика товара" ведет на `/calculator/:id/add`.
 */

import { motion } from "framer-motion";
import { useKeenSlider } from "keen-slider/react";
import {
  ArrowLeft,
  Star,
  Moon,
  Sun,
  BarChart3,
  Sparkles,
  Package,
  Info,
  Award,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

import { Button } from "../../../../../app/client/components/ui/button";
import { Card, CardContent, CardHeader } from "../../../../../app/client/components/ui/card";

import "keen-slider/keen-slider.min.css";
import { getProduct, analyzeProduct } from "@class/productService";

interface ProductInfo {
  id?: string | number;
  name?: string;
  title: string;
  brand: string;
  category: string;
  rating: number;
  reviewCount: number;
  price: number;
  image?: string;
  images: string[];
  description?: string;
  specifications?: Record<string, string>;
  seller?: {
    name?: string;
    rating?: string;
    status?: string;
    reviews?: string;
    details?: Record<string, string>;
  };
}

const adaptProduct = (raw: any): ProductInfo => ({
  id: raw.id || '',
  name: raw.name || raw.title || '',
  title: raw.title || "",
  brand: raw.brand || "",
  category: raw.category || "",
  rating: raw.rating || 0,
  reviewCount: raw.reviewCount || raw.reviews || 0,
  price: raw.price || 0,
  image: raw.image || (raw.images && raw.images[0]) || '',
  images: raw.images || (raw.image ? [raw.image] : []),
  description: raw.description || "",
  specifications: raw.specifications || raw.parameters || {},
  seller: raw.seller || {},
});

const ProductDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const [isDark, setIsDark] = useState(false);
  const [product, setProduct] = useState<ProductInfo | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showSimpleView, setShowSimpleView] = useState(false);
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    slidesPerView: 1,
    spacing: 16,
  });

  // Get product from location state if available
  const stateProduct = location.state?.product;
  useEffect(() => {
    if (stateProduct) {
      setProduct(adaptProduct(stateProduct));
    }
  }, [stateProduct]);

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  useEffect(() => {
    const loadProduct = async () => {
      const productId = id || "158944367";
      
      try {
        // Проверяем наличие продукта в кеше или базе данных
        const { data: productData } = await getProduct(productId);
        
        if (productData) {
          // Если продукт найден, обновляем состояние
          setProduct(adaptProduct(productData));
        } else {
          // Если продукт не найден, пробуем инициировать сбор данных
          const analysisStarted = await analyzeProduct(productId);
          if (analysisStarted) {
            // Показываем сообщение о том, что данные собираются
            setProduct({
              title: 'Данные собираются...',
              brand: '',
              category: '',
              rating: 0,
              reviewCount: 0,
              price: 0,
              images: [],
              description: 'Пожалуйста, подождите, пока мы соберем информацию о товаре.',
            });
            
            // Периодически проверяем наличие данных
            const checkInterval = setInterval(async () => {
              const { data: updatedProduct } = await getProduct(productId);
              if (updatedProduct) {
                clearInterval(checkInterval);
                setProduct(adaptProduct(updatedProduct));
              }
            }, 3000); // Проверяем каждые 3 секунды
            
            // Очищаем интервал при размонтировании компонента
            return () => clearInterval(checkInterval);
          } else {
            throw new Error('Не удалось начать сбор данных о товаре');
          }
        }
      } catch (error) {
        console.error("Ошибка загрузки товара:", error);
        setProduct(null);
      }
    };

    // Если продукт передан через состояние навигации, используем его
    // В противном случае загружаем из кеша/базы/запускаем сбор
    if (location.state?.product) {
      setProduct(adaptProduct(location.state.product));
      // Сохраняем в кеш для будущего использования
      const productData = adaptProduct(location.state.product);
      // Используем productService для сохранения в кеш
      const cacheKey = `${productData.id || productId}`;
      localStorage.setItem(`wb_product_${cacheKey}`, JSON.stringify({
        data: productData,
        timestamp: Date.now()
      }));
    } else {
      loadProduct();
    }
  }, [location.state, id]);

  useEffect(() => {
    const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(isDarkMode);
    if (isDarkMode) document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const bg = document.querySelector(".parallax-bg") as HTMLElement;
      if (bg) {
        const offset = window.scrollY;
        bg.style.transform = `scale(1.2) translateY(${offset * 0.2}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
    document.documentElement.classList.toggle("dark");
  };

  const goBack = () => navigate(-1);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
    }).format(amount);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-foreground text-sm">
        Данные не найдены...
      </div>
    );
  }

  // Simplified view that was requested
  const renderSimpleView = () => (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{product?.name || product?.title || `Товар #${id}`}</h1>
      <img
        src={product?.image || (product.images && product.images[0]) || '/placeholder-product.jpg'}
        alt={product?.name || product?.title}
        className="w-full max-w-md mx-auto mb-4 object-cover rounded shadow"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.onerror = null;
          target.src = '/placeholder-product.jpg';
        }}
      />
      <div className="text-lg font-semibold mb-2">
        Цена: {product?.price ? product.price.toLocaleString('ru-RU') + ' ₽' : 'Нет данных'}
      </div>
      {product?.rating !== null && product?.rating !== undefined && (
        <div className="text-sm text-gray-600">Рейтинг: ★ {product.rating.toFixed(1)}</div>
      )}
      <div className="mt-4 text-xs text-gray-400">
        <p>Источник: {location.state?.source || 'Неизвестно'}</p>
        <p>Просмотрено из: {location.state?.viewedFrom || 'Неизвестно'}</p>
        <p>Время: {location.state?.timestamp ? new Date(location.state.timestamp).toLocaleString() : 'Неизвестно'}</p>
      </div>
      <div className="mt-4">
        <Button 
          onClick={() => setShowSimpleView(false)}
          variant="outline"
          size="sm"
        >
          Показать детальную информацию
        </Button>
      </div>
    </div>
  );

  // Toggle between simple and detailed views
  if (showSimpleView) {
    return renderSimpleView();
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 relative overflow-hidden bg-background">
      {/* Theme Toggle */}
      <motion.button
        onClick={toggleTheme}
        className="absolute top-6 right-6 z-50 p-3 glass-button text-foreground"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </motion.button>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-start pt-20 p-4 max-w-md mx-auto w-full">
        <div className="mb-4 flex justify-end">
          <Button 
            onClick={() => setShowSimpleView(true)}
            variant="ghost" 
            size="sm"
            className="text-xs text-muted-foreground"
          >
            Упрощенный вид
          </Button>
        </div>
        <motion.div
          className="w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="mb-6">
            <Card className="glass-card border-0 shadow-xl">
              <CardHeader className="relative p-6">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={goBack}
                    className="glass-button text-foreground hover:bg-white/10 rounded-full h-10 w-10"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <h1 className="text-lg font-semibold text-foreground">Детали товара</h1>
                  <motion.div
                    className="ml-auto"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-5 h-5 text-primary opacity-60" />
                  </motion.div>
                </div>
              </CardHeader>
              
              {/* Product Image */}
              <div className="relative h-64 w-full overflow-hidden">
                <div className="absolute inset-0">
                  {product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover"
                      style={{
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        transform: "scale(1.2)",
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-muted/20 flex items-center justify-center">
                      <Package className="h-16 w-16 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Product Info */}
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                      {product.title}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      {product.brand}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-foreground">
                        {product.rating}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        ({product.reviewCount} отзывов)
                      </span>
                    </div>
                  </div>

                  <div className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    {formatCurrency(product.price)}
                  </div>

                  {/* Description */}
                  {product.description && (
                    <div className="pt-4 border-t border-border">
                      <h2 className="text-lg font-semibold mb-2 text-foreground">
                        Описание
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {product.description}
                      </p>
                    </div>
                  )}

                  {/* Specifications */}
                  {product.specifications && Object.keys(product.specifications).length > 0 && (
                    <div className="pt-4 border-t border-border">
                      <h2 className="text-lg font-semibold mb-3 text-foreground">
                        Характеристики
                      </h2>
                      <div className="space-y-2">
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-sm text-muted-foreground">{key}</span>
                            <span className="text-sm font-medium text-foreground text-right">
                              {value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>

              {/* Action Button */}
              <div className="px-6 pb-6">
                <Button
                  onClick={() => navigate(`/calculator/${id}/add`)}
                  className="w-full h-12 text-sm font-medium"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Аналитика товара
                </Button>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      <div className="max-w-md mx-auto px-4">
        <div ref={sliderRef} className="keen-slider pb-6">
          {product.description && (
            <div className="keen-slider__slide px-2">
              <Card className="glass-card border-0 shadow-xl h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Info className="w-5 h-5 text-primary" />
                    <h4 className="text-lg font-semibold text-foreground">Описание</h4>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="keen-slider__slide px-2">
              <Card className="glass-card border-0 shadow-xl h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Award className="w-5 h-5 text-primary" />
                    <h4 className="text-lg font-semibold text-foreground">Характеристики</h4>
                  </div>
                  <div className="space-y-2 text-sm max-h-full overflow-visible">
                    {Object.entries(product.specifications).map(([key, value], idx) => (
                      <div key={idx} className="flex justify-between">
                        <span className="text-muted-foreground">{key}:</span>
                        <span className="font-medium text-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {product.seller?.details && (
            <div className="keen-slider__slide px-2">
              <Card className="glass-card border-0 shadow-xl h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Info className="w-5 h-5 text-primary" />
                    <h4 className="text-lg font-semibold text-foreground">Продавец</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    {Object.entries(product.seller.details).map(([key, value], idx) => (
                      <div key={idx} className="flex justify-between">
                        <span className="text-muted-foreground">{key}:</span>
                        <span className="font-medium text-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
