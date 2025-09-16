import { FeatureCardProps } from '@types';
import { motion } from 'framer-motion';
import React from 'react';

import { cn } from '../../../../../../app/client/lib/utils';

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  className 
}) => {
  return (
    <motion.div 
      className={cn(
        "p-6 rounded-2xl neu hover:neu-hover transition-all duration-300 cursor-default",
        className
      )}
      whileHover={{ y: -5 }}
    >
      <div className="w-12 h-12 rounded-xl neu-inset flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </motion.div>
  );
};

export default FeatureCard;
