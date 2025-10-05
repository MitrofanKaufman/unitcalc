import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DebugProvider } from './components/common/DebugPanel';
import { NotificationProvider } from './components/common/NotificationProvider';
import MainLayout from './components/layout/MainLayout';
import ComponentsPage from './components/ComponentsPage';
import { HomePage } from './components/HomePage';
import ProductSearchPage from './components/ProductSearchPage';
import { AnalyticsPage } from './components/AnalyticsPage';
import { DocumentationPage } from './components/DocumentationPage';

// Основной компонент приложения
function App() {
  return (
    <DebugProvider enabled={true}>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="search" element={<ProductSearchPage />} />
              <Route path="wb-search" element={<ProductSearchPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="components" element={<ComponentsPage />} />
              <Route path="admin/documentation" element={<DocumentationPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </DebugProvider>
  );
}

export default App;
