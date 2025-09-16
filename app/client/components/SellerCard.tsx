import { motion } from "framer-motion";
import { ExternalLink, MessageSquare, Package, Shield, Star, Users } from "lucide-react";
import { useCallback, useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { SellerInfo } from "@/types/product";

interface SellerCardProps {
  seller: SellerInfo;
  isDark?: boolean;
  onViewDetails?: (seller: SellerInfo) => void;
  onContact?: (sellerId: string) => void;
  className?: string;
  disabled?: boolean;
}

export const SellerCard: React.FC<SellerCardProps> = ({
  seller, 
  isDark = false, 
  onViewDetails,
  onContact,
  className,
  disabled = false,
}) => {
  const handleCardClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button, a, [data-no-navigation]')) {
      return;
    }
    onViewDetails?.(seller);
  }, [onViewDetails, seller]);

  const handleContactClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onContact?.(seller.id);
    
    toast({
      title: 'Контакты продавца',
      description: `Свяжитесь с продавцом ${seller.name} через личные сообщения`,
    });
  }, [onContact, seller.id, seller.name]);

  const cardClasses = useMemo(() => 
    cn(
      'group transition-all duration-300 hover:shadow-lg',
      'bg-card text-card-foreground rounded-xl overflow-hidden',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      'cursor-pointer',
      className,
      {
        'opacity-70': disabled,
        'border border-border': !isDark,
        'bg-gray-900 text-white': isDark,
      }
    ),
    [className, disabled, isDark]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={cardClasses}
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onViewDetails?.(seller);
          }
        }}
        aria-label={`Карточка продавца ${seller.name}`}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            {seller.name}
            {seller.isVerified && (
              <Shield className="h-4 w-4 text-blue-500" aria-label="Проверенный продавец" />
            )}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {seller.followers?.toLocaleString() || '0'}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {seller.products?.toLocaleString() || '0'} товаров
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm text-muted-foreground">
                {seller.rating?.toFixed(1) || '0.0'}
                <span className="text-muted-foreground/70 text-xs">/5</span>
              </span>
            </div>
          </div>
          
          {seller.description && (
            <div className="text-sm text-muted-foreground line-clamp-2">
              {seller.description}
            </div>
          )}
          
          {seller.categories && seller.categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {seller.categories.slice(0, 3).map((category, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs font-normal"
                >
                  {category}
                </Badge>
              ))}
              {seller.categories.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{seller.categories.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between pt-0">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={handleContactClick}
            data-no-navigation
          >
            <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
            Связаться
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs"
            onClick={() => onViewDetails?.(seller)}
            data-no-navigation
          >
            Подробнее
            <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default SellerCard;