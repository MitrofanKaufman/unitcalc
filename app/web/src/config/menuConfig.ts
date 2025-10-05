import * as React from 'react';
import type { MenuItem } from '../components/layout/ResponsiveHeader';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import HistoryIcon from '@mui/icons-material/History';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import EventNoteIcon from '@mui/icons-material/EventNote';
import WidgetsIcon from '@mui/icons-material/Widgets';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const menuItems: MenuItem[] = [
  {
    id: 'admin',
    text: 'Админ панель',
    path: '/admin',
    icon: React.createElement(AdminPanelSettingsIcon),
    access: 'admin',
    children: [
      {
        id: 'settings',
        text: 'Настройки',
        path: '/admin/settings',
        icon: React.createElement(SettingsIcon),
        access: 'admin',
      },
      {
        id: 'documentation',
        text: 'Документация',
        path: '/admin/documentation',
        icon: React.createElement(DescriptionIcon),
        access: 'admin',
      },
      {
        id: 'components',
        text: 'Компоненты',
        path: '/admin/components',
        icon: React.createElement(WidgetsIcon),
        access: 'admin',
      },
      {
        id: 'changelog',
        text: 'Журнал изменений',
        path: '/admin/changelog',
        icon: React.createElement(HistoryIcon),
        access: 'admin',
      },
    ],
  },
  {
    id: 'services',
    text: 'Сервисы',
    path: '/services',
    icon: React.createElement(DashboardIcon),
    access: 'public',
    children: [
      {
        id: 'calculator',
        text: 'Калькулятор доходности',
        path: '/calculator',
        icon: React.createElement(AssessmentIcon),
        access: 'authenticated',
      },
      {
        id: 'unit-converter',
        text: 'Конвертер единиц',
        path: '/converter',
        icon: React.createElement(WidgetsIcon),
        access: 'authenticated',
      },
      {
        id: 'wb-search',
        text: 'Поиск товаров WB',
        path: '/wb-search',
        icon: React.createElement(ShoppingCartIcon),
        access: 'authenticated',
      },
      {
        id: 'product-search',
        text: 'Поиск товаров',
        path: '/search',
        icon: React.createElement(EventNoteIcon),
        access: 'public',
      },
    ],
  },
  {
    id: 'auth',
    text: 'Войти',
    path: '/login',
    icon: React.createElement(PersonIcon),
    access: 'public',
    hideWhenAuth: true,
  },
  {
    id: 'profile',
    text: 'Профиль',
    path: '/profile',
    icon: React.createElement(PersonIcon),
    access: 'authenticated',
    children: [
      {
        id: 'settings',
        text: 'Настройки',
        path: '/profile/settings',
        icon: React.createElement(SettingsIcon),
        access: 'authenticated',
      },
      {
        id: 'history',
        text: 'История',
        path: '/profile/history',
        icon: React.createElement(HistoryIcon),
        access: 'authenticated',
      },
      {
        id: 'logout',
        text: 'Выйти',
        path: '',
        icon: React.createElement(ExitToAppIcon),
        isLogout: true,
        access: 'authenticated',
      },
    ],
  },
];

export const getMenuItems = (userRole: string | null = null): MenuItem[] => {
  return menuItems.filter(item => {
    // Filter based on access level
    if (item.access === 'public') return true;
    if (item.access === 'authenticated' && userRole) return true;
    if (item.access === 'admin' && userRole === 'admin') return true;
    
    // Filter children based on access level
    if ('children' in item && item.children) {
      const filteredChildren = item.children.filter(child => {
        if (child.access === 'public') return true;
        if (child.access === 'authenticated' && userRole) return true;
        return child.access === 'admin' && userRole === 'admin';
      });
      
      // Only keep parent if it has visible children or is accessible itself
      return filteredChildren.length > 0 || 
             (item.access === 'authenticated' && userRole) ||
             (item.access === 'admin' && userRole === 'admin');
    }
    
    return false;
  });
};

export default menuItems;
