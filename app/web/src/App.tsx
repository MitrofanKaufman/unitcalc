import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DebugPanel from './components/layout/Debug/DebugPanel';
import { NotificationProvider } from './components/common/NotificationProvider';
import MainLayout from './components/layout/MainLayout';

// Импорты страниц
import { 
  HomePage, 
  ProductSearchPage, 
  DocumentationPage, 
  ComponentsPage 
} from './pages';

/**
 * Основной компонент приложения
 * @returns {JSX.Element} Корневой компонент приложения
 */
function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
          <Route path="/search" element={<MainLayout><ProductSearchPage /></MainLayout>} />
          <Route path="/documentation" element={<MainLayout><DocumentationPage /></MainLayout>} />
          <Route path="/components" element={<MainLayout><ComponentsPage /></MainLayout>} />
        </Routes>
        <DebugPanel position="bottom-right" />
      </BrowserRouter>
    </NotificationProvider>
  );
}

export default App;
