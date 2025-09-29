import { Routes, Route } from 'react-router-dom';
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
      {/* Основные инструменты приложения с MainLayout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<ProfitabilityCalculator />} />
        <Route path="calculator" element={<ProfitabilityCalculator />} />
      </Route>

      {/* Админ панель */}
      <Route path="/admin" element={<AdminPanel />}>
        <Route path="documentation" element={<Documentation />} />
        <Route path="settings" element={<Settings />} />
        <Route path="components" element={<Components />} />
        <Route path="changelog" element={<Changelog />} />
        <Route index element={<Documentation />} />
      </Route>
    </Routes>
  );
}

export default App;
