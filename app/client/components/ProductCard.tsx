// path: //app/client/components/ProductCard
/**
 *
 * Наименование файла: ProductCard
 * Расширение: .tsx
 * JavaScript с элементами TypeScript
 *
 * Компонент карточки товара.
 * Отображает информацию о товаре и обрабатывает навигацию к детальной странице.
 * 
 * @component
 * @example
 * <ProductCard 
 *   product={productData}
 *   onViewDetails={() => {}}
 *   onAddToFavorites={(productId) => {}}
 *   onShare={(product) => {}}
 *   onAnalytics={(productId) => {}}
 *   isDark={false}
 *   compact={false}
 *   className="custom-class"
 * />
 */

// eslint-disable-next-line

import React, { useState, useCallback, useMemo, MouseEvent, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@lib/utils';
import { Button } from '@components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip';
import { Check, Heart, Share2, BarChart2, ShoppingCart, Star, ChevronRight } from 'lucide-react';
import { Skeleton } from '@components/ui/skeleton';
import { Progress } from '@components/ui/progress';

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
};

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
  className = '',
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
  const handleCardClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Проверяем, не был ли клик по кнопке или ссылке
    const target = e.target as HTMLElement;
    if (target.closest('button, a, [data-no-navigation]')) {
      return;
    }
    
    onViewDetails?.(product);
  }, [onViewDetails, product]);

  // Обработчик нажатия клавиш
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onViewDetails?.(product);
    }
  }, [onViewDetails, product]);

  // Обработчик добавления в избранное
  const handleAddToFavoritesClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const newIsFavorite = !isFavorite;
    setIsFavorite(newIsFavorite);
    onAddToFavorites?.(product.id);
    
    // Показываем уведомление
    toast({
      title: newIsFavorite ? 'Добавлено в избранное' : 'Удалено из избранного',
      description: newIsFavorite 
        ? `${product.title} теперь в вашем списке избранного` 
        : `${product.title} удален из избранного`,
      variant: newIsFavorite ? 'default' : 'destructive',
    });
  }, [isFavorite, onAddToFavorites, product.id, product.title, toast]);

  // Обработчик добавления в корзину
  const handleAddToCart = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const newIsInCart = !isInCart;
    setIsInCart(newIsInCart);
    onAddToCart?.(product.id);
    
    // Показываем уведомление
    toast({
      title: newIsInCart ? 'Добавлено в корзину' : 'Удалено из корзины',
      description: newIsInCart 
        ? `${product.title} добавлен в вашу корзину` 
        : `${product.title} удален из корзины`,
      variant: 'default',
      action: newIsInCart ? (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/cart')}
          aria-label="Перейти в корзину"
        >
          В корзину
        </Button>
      ) : undefined,
    });
  }, [isInCart, onAddToCart, product.id, product.title, navigate, toast]);

  // Обработчик кнопки "Поделиться"
  const handleShareClick = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onShare?.(product);
    
    const shareUrl = `https://www.wildberries.ru/catalog/${product.id}/detail.aspx`;
    const shareData = {
      title: product.title,
      text: `Посмотрите ${product.title} на Wildberries`,
      url: shareUrl,
    };
    
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: 'Ссылка скопирована',
          description: 'Ссылка на товар скопирована в буфер обмена',
        });
      }
    } catch (error) {
      console.error('Ошибка при попытке поделиться:', error);
    }
  }, [onShare, product, toast]);

  // Обработчик кнопки аналитики
  const handleAnalyticsClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onAnalytics?.(product.id);
  }, [onAnalytics, product.id]);

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
    [
      className, 
      disabled, 
      isSelected, 
      isFirstInRow, 
      isLastInRow, 
      isSingleInRow
    ]
  );

  // Мемоизируем классы для изображения
  const imageClasses = useMemo(() => 
    cn(
      'w-full h-full object-cover transition-transform duration-300 group-hover:scale-105',
      {
        'opacity-0 group-hover:opacity-100': false,
      }
    ),
    []
  );

  // Рендер компактной карточки
  if (compact) {
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
        <div className="flex h-full">
          {/* Изображение товара */}
          <div className="w-1/3 relative">
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
              <div className="w-full h-full flex items-center justify-center bg-muted/30">
                <span className="text-muted-foreground">Нет изображения</span>
              </div>
            )}
          </div>
          
          {/* Информация о товаре */}
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <h2 className="font-semibold line-clamp-2 mb-1">
                {product.title}
              </h2>
              
              {/* Рейтинг */}
              <div className="flex items-center gap-1 mb-2">
                <div className="flex">
                  {ratingStars.map((star, index) => (
                    <Star
                      key={index}
                      className={cn(
                        'w-3 h-3',
                        star.isFilled 
                          ? 'fill-yellow-400 text-yellow-400' 
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
          <div className={`${compact ? 'aspect-[3/4]' : 'aspect-square'} bg-muted/50 rounded-lg overflow-hidden`}>
            {product.image ? (
              <img
                src={product.image}
                alt={product.title}
                className={imageClasses}
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
                disabled={isLoading}
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
              className={`font-semibold text-base line-clamp-2 h-12`} 
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
              <BarChart3 className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default React.memo(ProductCard);
  
  // Форматируем рейтинг в массив звезд
  const ratingStars = useMemo(
    () => formatRating(product.rating),
    [product.rating]
  );
  // Мемоизируем классы для карточки
  const cardClasses = useMemo(
    () =>
      cn(
        'group relative flex flex-col h-full transition-all duration-300 overflow-hidden',
        'bg-background text-foreground border border-border/50',
        'hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/20',
        {
          // Скругления углов в зависимости от позиции в сетке
          'rounded-tl-2xl rounded-br-2xl': isFirstInRow || isSingleInRow,
          'rounded-tr-2xl rounded-bl-2xl': isLastInRow,
          'rounded-2xl': isSingleInRow,
          'rounded-lg': !isFirstInRow && !isLastInRow && !isSingleInRow,
          
          // Границы между карточками
          'border-r border-b': isSecondInRow || isPreLastInRow,
          'border-r': isFirstInRow,
          'border-b': isLastInRow,
          
          // Тени в зависимости от темы
          'shadow-sm': !isDark,
          'shadow-md': isDark,
          
          // Состояния
          'opacity-70': isLoading,
          'ring-2 ring-primary': isFavorite,
        },
        className
      ),
    [isDark, isFirstInRow, isLastInRow, isSingleInRow, isSecondInRow, isPreLastInRow, className, isLoading, isFavorite]
  );
  
  // Мемоизируем классы для изображения
  const imageClasses = useMemo(
    () =>
      cn('w-full h-full object-cover transition-transform duration-300', {
        'group-hover:scale-105': !isLoading,
        'opacity-80': isLoading,
      }),
    [isLoading]
  );
  
  // Мемоизируем классы для кнопок действий
  const actionButtonClasses = useMemo(
    () =>
      cn('h-9 w-9 p-0 flex items-center justify-center', {
        'text-destructive': isFavorite,
        'hover:text-destructive': !isFavorite,
      }),
    [isFavorite]
  );

  /**
   * Обработчик навигации к деталям товара
   */
  const handleProductNavigation = useCallback(async () => {
    if (isLoading) return;
    
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
            source: 'product_card_click',
            cachedAt: result.cachedAt,
            from: window.location.pathname,
          },
          replace: false,
        });
      } else {
        // 3. Если товар не найден, сообщаем об этом
        toast.error('Информация о товаре временно недоступна');
      }
    } catch (error) {
      console.error('Ошибка при загрузке товара:', error);
      const errorMessage = error instanceof Error ? error.message : 'Не удалось загрузить информацию о товаре';
      
      toast.error(errorMessage, {
        description: 'Попробуйте обновить страницу или повторить попытку позже',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [navigate, onViewDetails, product.id, isLoading]);

  /**
   * Обработчик клика по карточке товара
   * @param e - Событие клика
   */
  const handleCardClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    // Предотвращаем всплытие события, если клик был по интерактивному элементу
    const target = e.target as HTMLElement;
    if (target.closest('button, a, [role="button"], [data-no-navigation]')) {
      return;
    }
    
    handleProductNavigation();
  }, [handleProductNavigation]);
  
  /**
   * Обработчик нажатия клавиш для доступности
   */
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick(e as unknown as React.MouseEvent<HTMLElement>);
    }
  }, [handleCardClick]);
  
  /**
   * Обработчик добавления в избранное
   */
  const handleAddToFavoritesClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const newFavoriteStatus = !isFavorite;
    setIsFavorite(newFavoriteStatus);
    
    if (onAddToFavorites) {
      onAddToFavorites(product.id);
    }
    
    toast.success(
      newFavoriteStatus ? 'Добавлено в избранное' : 'Удалено из избранного',
      {
        position: 'top-center',
        duration: 1500,
      }
    );
  }, [isFavorite, onAddToFavorites, product.id]);
  
  /**
   * Обработчик кнопки "Поделиться"
   */
  const handleShareClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    
    if (onShare) {
      onShare(product);
      return;
    }
    
    const shareData = {
      title: product.title,
      text: `Посмотрите ${product.title} на Wildberries`,
      url: `${window.location.origin}/product/${product.id}`,
    };
    
    if (navigator.share) {
      navigator.share(shareData).catch(err => {
        console.error('Ошибка при попытке поделиться:', err);
      });
    } else {
      // Fallback для браузеров без поддержки Web Share API
      navigator.clipboard.writeText(shareData.url);
      toast.success('Ссылка скопирована в буфер обмена');
    }
  }, [onShare, product]);
  
  /**
   * Обработчик кнопки аналитики
   */
  const handleAnalyticsClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    
    if (onAnalytics) {
      onAnalytics(product.id);
      return;
    }
    
    // Стандартное поведение - переход на страницу аналитики
    navigate(`/analytics/${product.id}`, {
      state: { product, from: 'product_card' }
    });
  }, [onAnalytics, product, navigate]);
  
  /**
   * Обработчик добавления в корзину
   */
  const handleAddToCart = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    
    // Здесь должна быть логика добавления в корзину
    setIsInCart(true);
    
    toast.success('Товар добавлен в корзину', {
      position: 'top-center',
      duration: 1500,
    });
  }, []);

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
              className={imageClasses}
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
          
          {/* Кнопка быстрого добавления в корзину */}
          <Button
            size="icon"
            variant="default"
            className={cn(
              'absolute bottom-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100',
              'transition-opacity duration-200',
              'shadow-md hover:scale-110',
              isInCart ? 'bg-green-500 hover:bg-green-600' : ''
            )}
            onClick={handleAddToCart}
            aria-label={isInCart ? 'Товар в корзине' : 'Добавить в корзину'}
            data-no-navigation
          >
            {isInCart ? (
              <span className="i-lucide-check w-4 h-4 text-white" />
            ) : (
              <ShoppingCart className="h-4 w-4" />
            )}
          </Button>
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
          <div className={`${compact ? 'aspect-[3/4]' : 'aspect-square'} bg-muted/50 rounded-lg overflow-hidden`}>
            {product.image ? (
              <img
                src={product.image}
                alt={product.title}
                className={imageClasses}
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
              className={`font-semibold text-base line-clamp-2 h-12`} 
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
              aria-label="Показать аналитику товара"
              data-no-navigation
            >
              <BarChart3 className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default React.memo(ProductCard);
