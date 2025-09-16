// path: src/components/ProductCard.tsx
/**
 * Компонент карточки товара.
 * Отображает информацию о товаре и обрабатывает навигацию к детальной странице.
 * 
 * @component
 * @param {Object} props - Свойства компонента
 * @param {ProductInfo} props.product - Информация о товаре
 * @param {Function} props.onViewDetails - Обработчик просмотра деталей товара
 * @param {Function} props.onAddToFavorites - Обработчик добавления в избранное
 * @param {Function} props.onShare - Обработчик кнопки "Поделиться"
 * @param {Function} props.onAnalytics - Обработчик кнопки аналитики
 * @param {boolean} [props.isDark=false] - Тема оформления (темная/светлая)
 * @param {boolean} [props.compact=false] - Компактный режим отображения
 * @param {boolean} [props.isFirstInRow] - Флаг первой карточки в ряду
 * @param {boolean} [props.isLastInRow] - Флаг последней карточки в ряду
 * @param {boolean} [props.isSingleInRow] - Флаг единственной карточки в ряду
 * @param {boolean} [props.isSecondInRow] - Флаг второй карточки в ряду
 * @param {boolean} [props.isPreLastInRow] - Флаг предпоследней карточки в ряду
 */

import { generateImageUrl } from "@class/generateImageUrl";
import { getProduct, analyzeProduct } from "@class/productService";
import { motion } from "framer-motion";
import {
  Star,
  Heart,
  Share2,
  BarChart3,
  MessageSquare,
  Loader2,
} from "lucide-react";
import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Badge } from "../../../../app/client/components/ui/badge";
import { Button } from "../../../../app/client/components/ui/button";
import { Card, CardContent } from "../../../../app/client/components/ui/card";

import { ProductInfo } from "@/types/product";

/**
 * Пропсы компонента ProductCard
 */
interface ProductCardProps {
  product: ProductInfo;
  isDark?: boolean;
  compact?: boolean;
  onViewDetails?: () => void;
  onAddToFavorites?: () => void;
  onShare?: () => void;
  onAnalytics?: () => void;
  isFirstInRow?: boolean;
  isLastInRow?: boolean;
  isSingleInRow?: boolean;
  isSecondInRow?: boolean;
  isPreLastInRow?: boolean;
}

interface ProductCardProps {
  product: ProductInfo;
  onViewDetails?: () => void;
  onAddToFavorites?: () => void;
  onShare?: () => void;
  onAnalytics?: () => void;
  isFirstInRow?: boolean;
  isLastInRow?: boolean;
  isSingleInRow?: boolean;
  isSecondInRow?: boolean;
  isPreLastInRow?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isDark = false,
  onViewDetails,
  onAddToFavorites,
  onShare,
  onAnalytics,
  isFirstInRow = false,
  isLastInRow = false,
  isSingleInRow = false,
  isSecondInRow = false,
  isPreLastInRow = false,
  compact = false,
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Обработчик навигации к товару
   */
  const handleProductNavigation = useCallback(async () => {
    // Вызываем кастомный обработчик, если он передан
    if (onViewDetails) {
      onViewDetails();
      return;
    }

    setIsLoading(true);

    try {
      // 1. Пытаемся получить данные о товаре
      const result = await getProduct(product.id.toString());
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      if (result.data) {
        // 2. Если товар найден, переходим к его деталям
        navigate(`/product/${product.id}`, { 
          state: { 
            product: result.data,
            source: result.source || 'direct_click',
            cachedAt: result.cachedAt
          } 
        });
      } else {
        // 3. Если товар не найден, инициируем сбор данных
        toast.loading("Запрашиваем актуальную информацию о товаре...");

        const analysisResult = await analyzeProduct(product.id.toString());
        
        if (!analysisResult.success) {
          throw new Error(analysisResult.error || 'Не удалось начать сбор данных');
        }

        // 4. Переходим на страницу сбора данных
        navigate(`/get/${product.id}`);
      }
    } catch (error) {
      console.error('Ошибка при обработке товара:', error);
      
      const errorMessage = error instanceof Error ? error.message : "Произошла неизвестная ошибка";
      
      toast.error(errorMessage);
      
      // В случае ошибки перенаправляем на страницу сбора данных
      navigate(`/get/${product.id}`, {
        state: { error: errorMessage }
      });
    } finally {
      setIsLoading(false);
    }
  }, [navigate, onViewDetails, product.id, toast]);

  /**
   * Обработчик клика по карточке товара
   * @param {React.MouseEvent} e - Событие клика
   */
  const handleCardClick = (e: React.MouseEvent) => {
    // Предотвращаем всплытие события, если клик был по интерактивному элементу
    if ((e.target as HTMLElement).closest('button, a, [role="button"]')) {
      return;
    }
    
    handleProductNavigation();
  };
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getBorderRadius = () => {
    if (isSingleInRow) {
      return 'rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-xl';
    }
    if (isFirstInRow) {
      return 'rounded-tl-xl';
    }
    if (isSecondInRow) {
      return 'rounded-tr-xl';
    }
    if (isPreLastInRow) {
      return 'rounded-bl-xl';
    }
    if (isLastInRow) {
      return 'rounded-br-xl';
    }
    return '';
  };

  if (compact) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="cursor-pointer"
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleCardClick(e as any)}
      >
        <Card
          className={`${
            isDark
              ? "bg-gray-900/90 border-gray-800"
              : "bg-white/90 border-gray-200"
          } backdrop-blur-lg border rounded-2xl shadow-xl overflow-hidden`}
        >
          <CardContent className="p-6">
            {/* Product Icon */}
            <div className="flex flex-col items-center text-center mb-4">
              <motion.div
                className="w-16 h-16 mb-4 rounded-2xl overflow-hidden shadow-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <img
                  src={generateImageUrl(product.id)}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Product Title */}
              <h3 className="text-lg font-bold text-foreground mb-3 leading-tight text-center">
                {product.name}
              </h3>

              {/* Rating and Reviews */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <div
                  className={`flex items-center gap-1 ${
                    isDark ? "bg-gray-800/60" : "bg-gray-100/60"
                  } backdrop-blur-sm rounded-full px-3 py-1.5 border ${
                    isDark ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-yellow-400 text-sm font-medium">
                    {product.reviewRating}
                  </span>
                </div>
                <Badge
                  variant="secondary"
                  className={`${
                    isDark
                      ? "bg-gray-800/60 text-gray-300"
                      : "bg-gray-100/60 text-gray-600"
                  } border-0 text-sm px-3 py-1 backdrop-blur-sm`}
                >
                  {product.feedbacks?.toLocaleString("ru-RU")} отзывов
                </Badge>
              </div>

              {/* Price */}
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-6">
                {formatCurrency(product.price)}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2 w-full">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onAddToFavorites}
                  className={`h-10 text-xs ${
                    isDark
                      ? "bg-gray-800/60 border-gray-700 text-gray-300 hover:bg-gray-700/60"
                      : "bg-gray-100/60 border-gray-300 text-gray-600 hover:bg-gray-200/60"
                  } backdrop-blur-sm`}
                >
                  <Heart className="w-3 h-3 mr-1" />В избранное
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onShare}
                  className={`h-10 text-xs ${
                    isDark
                      ? "bg-gray-800/60 border-gray-700 text-gray-300 hover:bg-gray-700/60"
                      : "bg-gray-100/60 border-gray-300 text-gray-600 hover:bg-gray-200/60"
                  } backdrop-blur-sm`}
                >
                  <Share2 className="w-3 h-3 mr-1" />
                  Поделиться
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onAnalytics}
                  className={`h-10 text-xs ${
                    isDark
                      ? "bg-gray-800/60 border-gray-700 text-gray-300 hover:bg-gray-700/60"
                      : "bg-gray-100/60 border-gray-300 text-gray-600 hover:bg-gray-200/60"
                  } backdrop-blur-sm`}
                >
                  <BarChart3 className="w-3 h-3 mr-1" />
                  Аналитика
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div 
      className={`product-image relative overflow-hidden aspect-square ${getBorderRadius()} cursor-pointer`} 
      style={{
        borderRadius: '0',
      }}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick(e as any)}
    >
      <img 
        src={generateImageUrl(product.id)} 
        alt={product.name}
        className="w-full h-full object-cover transition-transform duration-300"
        style={{ 
          transform: 'scale(1.05) translateZ(0)',
          transformOrigin: 'center center',
          willChange: 'transform'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute inset-0 flex flex-col justify-between p-4">
        <div className="absolute top-4 right-4 flex flex-col gap-2" style={{
          position: 'absolute',
          bottom: '0px',
          display: 'inline-flex',
          height: '100%'
        }}>
          <div className="bg-white/10 backdrop-blur-sm rounded-full p-1.5">
            <div className="flex items-center justify-center w-8 h-8 bg-yellow-400/10 rounded-full">
              <div className="flex items-center justify-center w-6 h-6 bg-yellow-400 rounded-full">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-yellow-400 font-medium text-sm">{product.rating}</span>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-full p-1.5">
            <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full">
              <div className="flex items-center justify-center w-6 h-6 bg-white/10 rounded-full">
                <MessageSquare className="w-3 h-3 text-white/90 fill-current" />
                <span className="text-sm text-white/90">{product.reviewCount}</span>
              </div>
            </div>
          </div>
        </div>
        <button 
          className="p-2 bg-black/60 text-white backdrop-blur-sm rounded-full hover:bg-black/70 transition-all duration-300"
          style={{ 
            transform: 'none',
            fontWeight: 'bolder',
            zoom: '0.8',
            textAlign: 'left',
            position: 'absolute',
            paddingLeft: '25px',
            paddingRight: '25px',
            bottom: '15px',
            marginRight: '15px'
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleProductNavigation();
          }}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
          ) : (
            product.name
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
