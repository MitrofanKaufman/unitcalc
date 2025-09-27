// \src\App.tsx
// Основной layout компонент приложения - содержит навигацию и основное содержимое

import { Navbar } from './components/layout/Navbar'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Unit Calculator
        </h1>
        {/* Здесь будет размещаться основное содержимое приложения */}
        <div className="text-center">
          <p className="text-gray-600">
            Добро пожаловать в Unit Calculator - приложение для расчёта единиц измерения
          </p>
        </div>
      </main>
    </div>
  )
}

export default App
