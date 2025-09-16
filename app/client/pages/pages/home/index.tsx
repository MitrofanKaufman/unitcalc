import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun, Box } from 'lucide-react';
import { NeuButton } from '@/ui-neu/neu-button';
import HeroSection from '@/pages/home/components/HeroSection';
import FeaturesSection from '@/pages/home/components/FeaturesSection';
import CTASection from '@/pages/home/components/CTASection';
import Footer from '@/pages/home/components/Footer';
import { containerVariants } from '@/core/types/containerVariants';
import '@/css/home.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Check system preference
    const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const handleStartCalculation = () => {
    navigate("/calculator");
  };

  if (!isMounted) return null;

  return (
    <motion.div 
      className="home-container min-h-screen bg-background text-foreground overflow-x-hidden snap-y snap-mandatory"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Navigation */}
      <nav className="nav-container container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Box className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            WB Calc
          </span>
        </div>
        <motion.button
          onClick={toggleTheme}
          className="neu-button w-10 h-10 rounded-lg flex items-center justify-center relative overflow-hidden"
          whileHover={{ 
            scale: 1.05,
            boxShadow: '3px 3px 8px var(--neu-shadow-dark), -3px -3px 8px var(--neu-shadow-light)'
          }}
          whileTap={{ 
            scale: 0.95,
            boxShadow: 'inset 2px 2px 4px var(--neu-shadow-dark), inset -2px -2px 4px var(--neu-shadow-light)'
          }}
          initial={false}
          style={{
            '--radius': '0.5rem',
            '--neu-bg': 'hsl(var(--background))',
            '--neu-shadow-dark': 'rgba(0, 0, 0, 0.15)',
            '--neu-shadow-light': 'rgba(255, 255, 255, 0.1)'
          }}
          transition={{ 
            type: 'spring',
            stiffness: 400,
            damping: 20
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isDark ? 'sun' : 'moon'}
              initial={{ opacity: 0, rotate: isDark ? 90 : -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: isDark ? -90 : 90 }}
              transition={{ duration: 0.3 }}
              className="absolute"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-500" />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.button>
      </nav>

      {/* Background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div 
          className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-primary/5 dark:bg-primary/10 blur-3xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            x: [0, 50, 0],
            y: [0, -50, 0]
          }}
          transition={{
            x: { duration: 20, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 25, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 1 },
            scale: { duration: 1 }
          }}
        />
        <motion.div 
          className="absolute top-3/4 left-1/4 w-1/2 h-1/2 rounded-full bg-secondary/5 dark:bg-secondary/10 blur-3xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            x: [0, -30, 0],
            y: [0, 30, 0]
          }}
          transition={{
            x: { duration: 25, repeat: Infinity, ease: "easeInOut", delay: 1 },
            y: { duration: 30, repeat: Infinity, ease: "easeInOut", delay: 2 },
            opacity: { duration: 1, delay: 0.3 },
            scale: { duration: 1, delay: 0.3 }
          }}
        />
      </div>

      {/* Page sections */}
      <HeroSection onStartCalculation={handleStartCalculation} />
      <FeaturesSection />
      <CTASection onStartCalculation={handleStartCalculation} />
      <Footer />
    </motion.div>
  );
};

export default HomePage;
