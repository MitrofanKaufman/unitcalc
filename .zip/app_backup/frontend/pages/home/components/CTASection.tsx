import React from 'react';
import { motion } from 'framer-motion';
import { NeuButton } from '@/ui-neu/neu-button';
import { ArrowRight } from 'lucide-react';
import { containerVariants } from '@/core/types/containerVariants';
import { itemVariants } from '@/core/types/itemVariants';

interface CTASectionProps {
  onStartCalculation: () => void;
}

const CTASection: React.FC<CTASectionProps> = ({ onStartCalculation }) => {
  return (
    <motion.section 
      className="cta-section py-16 md:py-24 snap-start"
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.div 
        className="container mx-auto px-4"
        variants={containerVariants}
      >
        <div className="cta-card">
          <motion.div 
            className="text-center max-w-2xl mx-auto"
            variants={itemVariants}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Начните зарабатывать больше уже сегодня</h2>
            <motion.p 
              className="text-muted-foreground mb-8"
              variants={itemVariants}
            >
              Присоединяйтесь к тысячам продавцов, которые уже увеличили свою прибыль с нашим калькулятором
            </motion.p>
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <NeuButton 
                size="lg" 
                className="group relative overflow-hidden"
                onClick={onStartCalculation}
              >
                <span className="relative z-10 flex items-center">
                  Начать бесплатно
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.span 
                  className="absolute inset-0 bg-primary/10"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </NeuButton>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default CTASection;
