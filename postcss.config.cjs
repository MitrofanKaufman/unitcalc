// postcss.config.cjs
// Конфигурация PostCSS для обработки CSS с помощью плагинов
// Оптимизирована для Tailwind CSS v4.1.13

module.exports = {
  plugins: {
    // Обработка @import
    'postcss-import': {},
    
    // Современный плагин для вложенности CSS
    'postcss-nesting': {},
    
    // Tailwind CSS с настройками по умолчанию
    '@tailwindcss/postcss': {
      // Дополнительные настройки, если необходимо
    },
    
    // Автопрефиксер с настройками по умолчанию
    autoprefixer: {},
  },
};
