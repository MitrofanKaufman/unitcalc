import React from 'react';
import { Package } from 'lucide-react';

interface ImagePlaceholderProps {
  size?: number;
  className?: string;
}

export const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({ size = 24, className = '' }) => {
  return (
    <div className={`flex items-center justify-center rounded-lg bg-muted/20 ${className}`}>
      <Package className={`h-${size} w-${size} text-muted-foreground/30`} />
    </div>
  );
};
