import React from 'react';
import { motion } from 'framer-motion';
import { Box } from 'lucide-react';
import { containerVariants } from '@/core/types/containerVariants';
import { itemVariants } from '@/core/types/itemVariants';

const Footer: React.FC = () => {
  return (
    <motion.footer 
      className="footer border-t border-border/50 py-8 snap-start"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
    >
      <motion.div 
        className="container mx-auto px-4"
        variants={containerVariants}
      >
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-center"
          variants={itemVariants}
        >
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <motion.div 
              className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center"
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Box className="w-4 h-4 text-primary-foreground" />
            </motion.div>
            <span className="font-bold">WB Calc</span>
          </div>
          <motion.p 
            className="text-sm text-muted-foreground"
            variants={itemVariants}
          >
            © {new Date().getFullYear()} WB Calculator. Все права защищены.
          </motion.p>
        </motion.div>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
