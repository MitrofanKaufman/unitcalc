import { motion } from 'framer-motion';
import React from 'react';

const SkeletonProductCard: React.FC = () => {
  return (
    <motion.div
      className="product-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="skeleton-image w-full h-full bg-gray-800/30 rounded-t-xl animate-pulse" />
      <div className="skeleton-name bg-gray-800/30 h-12 rounded-b-xl animate-pulse" />
      <div className="skeleton-counters flex gap-2 mt-2">
        <div className="skeleton-icon w-6 h-6 bg-gray-800/30 rounded-full animate-pulse" />
        <div className="skeleton-icon w-6 h-6 bg-gray-800/30 rounded-full animate-pulse" />
      </div>
    </motion.div>
  );
};

export default SkeletonProductCard;
