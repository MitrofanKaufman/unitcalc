import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation, useInView } from 'framer-motion';
import { ArrowRight, Box, Zap } from 'lucide-react';
import { containerVariants, itemVariants } from '@/core/types/containerVariants';
import { NeuButton } from '@/components/ui-neu/neu-button';

const HeroSection: React.FC<{ onStartCalculation: () => void }> = ({ onStartCalculation }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const navigate = useNavigate();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  return (
    <motion.section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center"
      initial="hidden"
      animate={controls}
      variants={containerVariants}
      style={{ overflow: 'hidden' }}
    >
      <div className="absolute inset-0 -z-10 bg-grid-pattern opacity-5" />
      
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">

          <motion.h1
            className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            variants={itemVariants}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Рассчитайте прибыль
            </span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 mt-2">
              Unit.Calculator
            </span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            Расчет рентабельности товаров с учетом затрат <br />
            на логистику, комиссий и налогов в пару кликов.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-12 mb-16"
            variants={itemVariants}
          >
            <div className="h-[56px]">
              <NeuButton
                size="lg"
                className="group h-full px-8 text-[15px] font-semibold tracking-wide"
                style={{
                  '--shadow-color': '99, 102, 241',
                  '--light-shadow': '255, 255, 255',
                  '--shadow-default': '0 3px 10px -1px rgba(var(--shadow-color), 0.15)',
                  '--shadow-hover': '0 4px 12px -1px rgba(var(--shadow-color), 0.2)',
                  '--shadow-press': 'inset 1px 1px 3px rgba(0, 0, 0, 0.15), inset -1px -1px 3px rgba(var(--light-shadow), 0.7)'
                } as React.CSSProperties}
                onClick={onStartCalculation}
                whileHover={{ 
                  y: -2,
                  boxShadow: 'var(--shadow-hover)',
                  transition: { duration: 0.2 }
                }}
                whileTap={{ 
                  scale: 0.98,
                  boxShadow: 'var(--shadow-press)',
                  y: 1,
                  transition: { 
                    duration: 0.1,
                    boxShadow: { duration: 0.1 }
                  }
                }}
              >
                <span className="relative z-10 text-[15.5px] font-semibold">Начать расчет</span>
                <motion.span 
                  className="inline-flex items-center ml-2.5"
                  initial={{ x: 0 }}
                  whileHover={{ x: 3, color: 'hsl(var(--primary))' }}
                  transition={{ type: 'spring', stiffness: 600, damping: 15 }}
                >
                  <ArrowRight className="w-4.5 h-4.5" />
                </motion.span>
              </NeuButton>
            </div>

            <div className="h-[56px]">
              <NeuButton
                variant="outline"
                size="lg"
                className="group h-full px-8 text-[15px] font-semibold tracking-wide"
                style={{
                  '--shadow-color': '99, 102, 241',
                  '--light-shadow': '255, 255, 255',
                  '--shadow-default': '0 2px 6px -1px rgba(var(--shadow-color), 0.08)',
                  '--shadow-hover': '0 3px 8px -1px rgba(var(--shadow-color), 0.1)',
                  '--shadow-press': 'inset 1px 1px 2px rgba(0, 0, 0, 0.1), inset -1px -1px 2px rgba(var(--light-shadow), 0.8)'
                } as React.CSSProperties}
                onClick={() => navigate('/search')}
                initial={{ scale: 0.98 }}
                whileHover={{ 
                  scale: 1.01,
                  y: -1,
                  backgroundColor: 'hsl(var(--muted))',
                  boxShadow: 'var(--shadow-hover)',
                  transition: { 
                    duration: 0.2,
                    scale: { duration: 0.2 }
                  }
                }}
                whileTap={{ 
                  scale: 0.97,
                  boxShadow: 'var(--shadow-press)',
                  y: 0,
                  transition: { 
                    duration: 0.1,
                    boxShadow: { duration: 0.1 },
                    scale: { duration: 0.1 }
                  }
                }}
              >
                <motion.span 
                  className="inline-flex items-center mr-2.5"
                  initial={{ color: 'inherit' }}
                  whileHover={{ color: 'hsl(var(--primary))' }}
                  transition={{ duration: 0.2 }}
                >
                  <Search className="w-4.5 h-4.5" />
                </motion.span>
                <span className="text-[15.5px] font-semibold">Найти товар</span>
              </NeuButton>
            </div>
          </motion.div>



        </div>
      </div>
    </motion.section>
  );
};

export default HeroSection;
