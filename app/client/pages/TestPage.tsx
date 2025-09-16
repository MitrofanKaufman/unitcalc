// Тестовая страница для проверки работы Tailwind CSS
import React from 'react';

const TestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Тестовая страница</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Проверка Tailwind CSS</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-100 text-blue-800 rounded border border-blue-200">
              Это синее уведомление - проверка цветов и отступов
            </div>
            
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
              Тестовая кнопка
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="p-4 bg-white border rounded-lg shadow-sm">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="text-sm text-gray-500 mt-8">
          Если вы видите стилизованные элементы, значит Tailwind CSS работает корректно.
        </div>
      </div>
    </div>
  );
};

export default TestPage;
