import React, { useState } from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import ResponsiveHeader from './ResponsiveHeader';
import type { MenuItem, UserData } from './ResponsiveHeader';
import { useNavigate } from 'react-router-dom';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  
  // Mock authentication state - replace with your actual auth logic
  const isAuthenticated = false;
  const user = null;

  // Define menu items
  const menuItems: MenuItem[] = [
    {
      id: 'home',
      text: 'Главная',
      path: '/',
      access: 'public',
    },
    {
      id: 'calculator',
      text: 'Калькулятор',
      path: '/calculator',
      access: 'public',
    },
    {
      id: 'profile',
      text: 'Профиль',
      path: '/profile',
      access: 'authenticated',
    },
    {
      id: 'admin',
      text: 'Админ панель',
      path: '/admin',
      access: 'admin',
    },
    {
      id: 'logout',
      text: 'Выйти',
      path: '/logout',
      access: 'authenticated',
      isLogout: true,
    },
  ];

  // Handle logout
  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logging out...');
    navigate('/login');
  };

  // Toggle theme
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Create theme based on dark mode
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
      background: {
        default: darkMode ? '#121212' : '#f5f5f5',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            margin: 0,
            padding: 0,
            minHeight: '100vh',
          },
          '#root': {
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <ResponsiveHeader
          menuItems={menuItems}
          isAuthenticated={isAuthenticated}
          user={user}
          onLogout={handleLogout}
          darkMode={darkMode}
          onThemeChange={toggleTheme}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            marginTop: '64px', // Height of the AppBar
            width: { md: `calc(100% - 240px)` },
            ml: { md: '240px' },
          }}
        >
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default MainLayout;
