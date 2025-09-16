import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/theme/ui/card";
import { Users, Package, Star } from "lucide-react";
import { SellerInfo } from "@core/types/product";

interface SellerCardProps {
  seller: SellerInfo;
  isDark?: boolean;
}

export const SellerCard: React.FC<SellerCardProps> = ({ seller, isDark = false }) => {
  return (
    <Card className={`transition-all duration-300 ${isDark ? 'bg-gray-900' : 'bg-white'} hover:shadow-lg`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{seller.name}</CardTitle>
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-gray-500" />
          <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
            {seller.rating}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-gray-500" />
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                {seller.products} товаров
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-400" />
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                {seller.rating}⭐
              </span>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {seller.description}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SellerCard;