import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, BarChart, DollarSign } from 'lucide-react';
import FeatureCard from '@pages/home/FeatureCard';
import { containerVariants } from '@/core/types/containerVariants';
import { itemVariants } from '@/core/types/itemVariants';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Calculator,
      title: "Быстрый расчет",
      description: "Мгновенный расчет всех затрат и прибыли в несколько кликов"
    },
    {
      icon: BarChart,
      title: "Детальная аналитика",
      description: "Полная разбивка по всем статьям расходов и доходам"
    },
    {
      icon: DollarSign,
      title: "Максимальная прибыль",
      description: "Оптимизация цен для увеличения вашей выручки"
    }
  ];

  return (
    <motion.section 
      className="features-section py-16 md:py-24"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          variants={itemVariants}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Почему выбирают нас</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Все необходимое для точного расчета прибыли с продаж на Wildberries
          </p>
        </motion.div>
        
        <motion.div 
          className="features-grid grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              custom={index}
            >
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                className={index === 1 ? "md:translate-y-6" : ""}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default FeaturesSection;
