import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import AdminPanel from '@/components/features/admin/AdminPanel';
import Documentation from '@/components/features/admin/Documentation';
import Settings from '@/components/features/admin/Settings';
import Components from '@/components/features/admin/Components';
import Changelog from '@/components/features/admin/Changelog';
import { ProfitabilityCalculator } from '@/components/features/profitability-calculator/ProfitabilityCalculator';

function App() {
  return (
    <Routes>
      {/* Основной макет с навигацией */}
      <Route path="/" element={<MainLayout />}>
        {/* Основные маршруты */}
        <Route index element={<Navigate to="/calculator" replace />} />
        <Route path="calculator" element={<ProfitabilityCalculator />} />
        
        {/* Админ панель */}
        <Route path="admin" element={<AdminPanel />}>
          <Route index element={<Navigate to="documentation" replace />} />
          <Route path="documentation" element={<Documentation />} />
          <Route path="settings" element={<Settings />} />
          <Route path="components" element={<Components />} />
          <Route path="changelog" element={<Changelog />} />
        </Route>
        
        {/* Другие маршруты */}
        <Route path="*" element={<Navigate to="/calculator" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
