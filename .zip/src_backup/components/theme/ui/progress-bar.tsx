import React from 'react';
import { motion } from 'framer-motion';

type ProgressBarProps = {
  progress: number; // Значение от 0 до 100
  status?: string; // Текущий статус (опционально)
  className?: string;
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  status,
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`}>
      {status && (
        <div className="flex justify-between text-sm text-muted-foreground mb-1">
          <span>{status}</span>
          <span>{Math.round(progress)}%</span>
        </div>
      )}
      
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
};
