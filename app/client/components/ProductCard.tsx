/**
 * Компонент карточки товара.
 * Отображает информацию о товаре и обрабатывает навигацию к детальной странице.
 */

import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, Heart, Share2, BarChart2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

// Тип для продукта
type Product = {
  id: string;
  title: string;
  price: number;
  oldPrice?: number;
  image?: string;
  images?: string[];
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isFavorite?: boolean;
  isInCart?: boolean;
  brand?: string;
};

// Тип для пропсов компонента
type ProductCardProps = {
  product: Product;
  onViewDetails?: (product: Product) => void;
  onAddToFavorites?: (productId: string) => void;
  onAddToCart?: (productId: string) => void;
  onShare?: (product: Product) => void;
  onAnalytics?: (productId: string) => void;
  isFirstInRow?: boolean;
  isLastInRow?: boolean;
  isSingleInRow?: boolean;
  isSecondInRow?: boolean;
  isPreLastInRow?: boolean;
  compact?: boolean;
  disabled?: boolean;
  isSelected?: boolean;
  hoverImage?: boolean;
  className?: string;
  isDark?: boolean;
};

// Вспомогательная функция для форматирования цены
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0
  }).format(price);
};

// Вспомогательная функция для форматирования рейтинга в звезды
const formatRating = (rating: number) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push({ isFilled: true, isHalf: false });
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push({ isFilled: false, isHalf: true });
    } else {
      stars.push({ isFilled: false, isHalf: false });
    }
  }
  
  return stars;
};

// Вспомогательная функция для расчета скидки
const calculateDiscountPercentage = (oldPrice: number, newPrice: number): number => {
  return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
};

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  onAddToFavorites,
  onAddToCart,
  onShare,
  onAnalytics,
  compact = false,
  isDark = false,
  className = '',
  isFirstInRow = false,
  isLastInRow = false,
  isSingleInRow = false,
  isSecondInRow = false,
  isPreLastInRow = false,
  disabled = false,
  isSelected = false,
  hoverImage = false,
}) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState<boolean>(product.isFavorite ?? false);
  const [isInCart, setIsInCart] = useState<boolean>(product.isInCart ?? false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Рассчитываем скидку, если есть старая цена
  const discountPercentage = useMemo(() => 
    product.oldPrice && product.oldPrice > product.price
      ? calculateDiscountPercentage(product.oldPrice, product.price)
      : 0,
    [product.oldPrice, product.price]
  );

  // Форматируем рейтинг в массив звезд
  const ratingStars = useMemo(
    () => formatRating(product.rating),
    [product.rating]
  );

  // Обработчик клика по карточке
  const handleCardClick = useCallback(() => {
    if (onViewDetails) {
      onViewDetails(product);
    }
  }, [onViewDetails, product]);

  // Обработчик нажатия клавиш
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  }, [handleCardClick]);

  // Обработчик добавления в избранное
  const handleAddToFavoritesClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const newIsFavorite = !isFavorite;
    setIsFavorite(newIsFavorite);
    
    if (onAddToFavorites) {
      onAddToFavorites(product.id);
    }
    
    toast({
      title: newIsFavorite ? 'Добавлено в избранное' : 'Удалено из избранного',
      description: newIsFavorite 
        ? `${product.title} теперь в вашем списке избранного` 
        : `${product.title} удален из избранного`,
    });
  }, [isFavorite, onAddToFavorites, product.id, product.title]);

  // Обработчик добавления в корзину
  const handleAddToCart = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const newIsInCart = !isInCart;
    setIsInCart(newIsInCart);
    
    if (onAddToCart) {
      onAddToCart(product.id);
    }
    
    toast({
      title: newIsInCart ? 'Добавлено в корзину' : 'Удалено из корзины',
      description: newIsInCart 
        ? `${product.title} добавлен в вашу корзину` 
        : `${product.title} удален из корзины`,
    });
  }, [isInCart, onAddToCart, product.id, product.title]);

  // Обработчик кнопки "Поделиться"
  const handleShareClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    
    if (onShare) {
      onShare(product);
      return;
    }
    
    const shareUrl = `${window.location.origin}/product/${product.id}`;
    const shareData = {
      title: product.title,
      text: `Посмотрите ${product.title} на нашем сайте`,
      url: shareUrl,
    };
    
    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: 'Ссылка скопирована',
        description: 'Ссылка на товар скопирована в буфер обмена',
      });
    }
  }, [onShare, product]);

  // Обработчик кнопки аналитики
  const handleAnalyticsClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    
    if (onAnalytics) {
      onAnalytics(product.id);
      return;
    }
    
    navigate(`/analytics/${product.id}`, {
      state: { product, from: 'product_card' }
    });
  }, [onAnalytics, product, navigate]);

  // Мемоизируем классы для карточки
  const cardClasses = useMemo(() => 
    cn(
      'relative group bg-card text-card-foreground rounded-xl overflow-hidden',
      'transition-all duration-200 ease-in-out',
      'hover:shadow-lg hover:shadow-primary/10',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'cursor-pointer',
      className,
      {
        'opacity-70': disabled,
        'ring-2 ring-primary': isSelected,
        'border border-border': !isSelected,
        'ml-0': isFirstInRow || isSingleInRow,
        'mr-0': isLastInRow || isSingleInRow,
      }
    ),
    [className, disabled, isSelected, isFirstInRow, isLastInRow, isSingleInRow]
  );

  // Рендер компактной карточки
  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className={cn(
          'relative flex flex-col h-full bg-card rounded-xl overflow-hidden',
          'border border-border/50 hover:border-primary/30',
          'transition-all duration-200 ease-in-out',
          className
        )}
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={`${product.title} - ${formatPrice(product.price)}`}
      >
        {/* Бейдж скидки */}
        {discountPercentage > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute top-2 left-2 z-10 px-1.5 py-0.5 text-xs font-bold"
          >
            -{discountPercentage}%
          </Badge>
        )}
        
        {/* Изображение товара */}
        <div className="relative aspect-square bg-muted/30">
          {product.image ? (
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
              loading="lazy"
              width={200}
              height={200}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-product.svg';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted/20">
              <span className="text-muted-foreground text-xs">Нет фото</span>
            </div>
          )}
        </div>
        
        {/* Контент карточки */}
        <div className="p-3 flex flex-col flex-1">
          {/* Название */}
          <h3 
            className="text-sm font-medium line-clamp-2 mb-1.5"
            title={product.title}
          >
            {product.title}
          </h3>
          
          {/* Бренд */}
          {product.brand && (
            <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
              {product.brand}
            </p>
          )}
          
          <div className="mt-auto">
            {/* Рейтинг и отзывы */}
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center">
                {ratingStars.map((star, index) => (
                  <Star
                    key={index}
                    className={cn(
                      'w-3 h-3',
                      star.isFilled 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : star.isHalf
                        ? 'text-yellow-400'
                        : 'text-muted-foreground/30'
                    )}
                    aria-hidden="true"
                  />
                ))}
              </div>
              {product.reviewCount > 0 && (
                <span className="text-xs text-muted-foreground">
                  {product.reviewCount.toLocaleString('ru-RU')}
                </span>
              )}
            </div>
            
            {/* Цена */}
            <div className="space-y-0.5">
              {product.oldPrice && product.oldPrice > product.price && (
                <div className="text-xs text-muted-foreground line-through">
                  {formatPrice(product.oldPrice)}
                </div>
              )}
              <div className={cn(
                'font-bold',
                product.oldPrice && product.oldPrice > product.price ? 'text-destructive' : ''
              )}>
                {formatPrice(product.price)}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Рендер полной карточки товара
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cardClasses}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`${product.title} - ${formatPrice(product.price)}`}
    >
      <Card className="h-full flex flex-col border-0 shadow-none bg-transparent">
        <div className="relative group">
          {/* Бейдж скидки */}
          {discountPercentage > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute top-3 left-3 z-10 px-2 py-1 text-sm font-bold"
              aria-label={`Скидка ${discountPercentage}%`}
            >
              -{discountPercentage}%
            </Badge>
          )}
          
          {/* Бейдж новинки */}
          {product.isNew && (
            <Badge 
              variant="secondary" 
              className="absolute top-3 right-3 z-10 px-2 py-1 text-sm font-bold"
            >
              Новинка
            </Badge>
          )}
          
          {/* Изображение товара */}
          <div className="aspect-square bg-muted/50 rounded-lg overflow-hidden">
            {product.image ? (
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                width={400}
                height={400}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-product.svg';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted/30">
                <span className="text-muted-foreground">Нет изображения</span>
              </div>
            )}
            
            {/* Кнопка быстрого добавления в корзину */}
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                size="icon" 
                className="rounded-full h-12 w-12 shadow-lg"
                onClick={handleAddToCart}
                aria-label={isInCart ? 'Товар в корзине' : 'Добавить в корзину'}
                data-no-navigation
              >
                {isInCart ? (
                  <span className="i-lucide-check w-5 h-5" />
                ) : (
                  <ShoppingCart className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <CardContent className="flex-1 flex flex-col p-4 gap-3">
          {/* Название и бренд */}
          <div className="space-y-1">
            {product.brand && (
              <h3 className="text-sm font-medium text-muted-foreground line-clamp-1" aria-label="Бренд">
                {product.brand}
              </h3>
            )}
            <h2 
              className="font-semibold text-base line-clamp-2 h-12" 
              title={product.title}
              aria-label="Название товара"
            >
              {product.title}
            </h2>
          </div>

          {/* Рейтинг и отзывы */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center" aria-label={`Рейтинг: ${product.rating} из 5`}>
              {ratingStars.map((star, index) => (
                <Star
                  key={index}
                  className={cn(
                    'w-4 h-4',
                    star.isFilled 
                      ? 'fill-yellow-400 text-yellow-400' 
                      : star.isHalf
                      ? 'text-yellow-400'
                      : 'text-muted-foreground/30'
                  )}
                  aria-hidden="true"
                />
              ))}
            </div>
            {product.reviewCount > 0 && (
              <span className="text-sm text-muted-foreground ml-1" aria-label="Количество отзывов">
                {product.reviewCount.toLocaleString('ru-RU')}
              </span>
            )}
          </div>

          {/* Цена */}
          <div className="mt-auto space-y-1">
            {product.oldPrice && product.oldPrice > product.price && (
              <div className="text-sm text-muted-foreground line-through" aria-hidden="true">
                {formatPrice(product.oldPrice)}
              </div>
            )}
            <div className={cn(
              'text-xl font-bold',
              product.oldPrice && product.oldPrice > product.price ? 'text-destructive' : ''
            )}>
              {formatPrice(product.price)}
              {product.oldPrice && product.oldPrice > product.price && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  -{discountPercentage}%
                </span>
              )}
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              size="default"
              className="flex-1 h-10"
              onClick={handleAddToFavoritesClick}
              disabled={isLoading}
              aria-label={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
              data-no-navigation
            >
              <Heart 
                className={cn('h-5 w-5', {
                  'fill-destructive text-destructive': isFavorite,
                })} 
                aria-hidden="true"
              />
              <span className="ml-2">{isFavorite ? 'В избранном' : 'В избранное'}</span>
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={handleShareClick}
              disabled={isLoading}
              aria-label="Поделиться товаром"
              data-no-navigation
            >
              <Share2 className="h-4 w-4" aria-hidden="true" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={handleAnalyticsClick}
              disabled={isLoading}
              aria-label="Показать аналитику товара"
              data-no-navigation
            >
              <BarChart2 className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default React.memo(ProductCard);
