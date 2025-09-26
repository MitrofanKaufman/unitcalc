import { motion } from 'framer-motion';
import React from 'react';

const NeumorphicDemo: React.FC = () => {
  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-200 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Главный контейнер */}
      <section className="container-neumorphic max-w-4xl mx-auto mb-8">
        <h1 className="text-3xl font-bold mb-4">Neumorphic UI Demo</h1>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          Пример секции с неоморфным контейнером. Тема автоматически подстраивается под светлую / тёмную.
        </p>

        {/* Карточки */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card-neumorphic p-4">
            <h2 className="text-xl font-semibold mb-2">Карточка 1</h2>
            <p>Контент карточки с лёгким неоморфным эффектом.</p>
            <button className="btn-neumorphic mt-4">Нажми меня</button>
          </div>

          <div className="card-neumorphic-inset p-4">
            <h2 className="text-xl font-semibold mb-2">Карточка 2 (Inset)</h2>
            <p>Карточка с эффектом вдавленности.</p>
            <button className="btn-glass mt-4">Glass Button</button>
          </div>
        </div>
      </section>

      {/* Форма */}
      <section className="container-neumorphic max-w-2xl mx-auto mb-8">
        <h2 className="text-2xl font-bold mb-4">Форма обратной связи</h2>
        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Ваше имя"
            className="input-neumorphic"
          />
          <input
            type="email"
            placeholder="Email"
            className="input-neumorphic"
          />
          <textarea
            placeholder="Сообщение"
            className="input-neumorphic h-32"
          />
          <button type="submit" className="btn-neumorphic w-32 mx-auto">
            Отправить
          </button>
        </form>
      </section>

      {/* Glassmorphism секция */}
      <section className="glass-section max-w-3xl mx-auto p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-2">Glassmorphic Panel</h2>
        <p>
          Панель с эффектом стекла. Можно использовать для модальных окон,
          всплывающих подсказок или виджетов.
        </p>
        <div className="mt-4 flex gap-4">
          <button className="btn-glass">Принять</button>
          <button className="btn-glass">Отменить</button>
        </div>
      </section>
    </div>
  );
};

export default NeumorphicDemo;
