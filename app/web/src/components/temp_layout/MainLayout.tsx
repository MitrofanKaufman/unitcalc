import React, { useState, useMemo } from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme, Typography } from '@mui/material';
import { useNavigate, Outlet } from 'react-router-dom';
import ResponsiveHeader, { type UserData, type MenuItem } from './ResponsiveHeader';
import Footer from './Footer';
import { getMenuItems } from '@/config/menuConfig';

// AnimatedHeading component
export const AnimatedHeading: React.FC<React.ComponentProps<typeof Typography>> = (props) => {
  return (
    <Typography
      {...props}
      sx={{
        ...props.sx,
        background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        animation: 'fadeIn 1s ease-in-out',
        '@keyframes fadeIn': {
          '0%': {
            opacity: 0,
            transform: 'translateY(-10px)',
          },
          '100%': {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
      }}
    />
  );
};

const MainLayout: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  // Mock authentication state - replace with your actual auth logic
  const isAuthenticated = true; // Set to true to see the menu items
  const user: UserData | null = isAuthenticated ? {
    name: 'Test User',
    avatar: '',
    role: 'admin' // Set to 'admin' to see all menu items including admin ones
  } : null;

  // Get menu items based on user role
  const currentUserRole = isAuthenticated ? (user?.role || 'user') : 'guest';
  const menuItemsList: MenuItem[] = getMenuItems(currentUserRole);

  // Handle logout
  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logging out...');
    navigate('/login');
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
        },
      }),
    [darkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
        <ResponsiveHeader
          menuItems={menuItemsList}
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
            width: '100%',
            p: 3,
            pt: '80px',
            bgcolor: 'background.default',
            '& > *': {
              maxWidth: '100%',
              width: '100%',
              mx: 'auto',
              px: { xs: 2, md: 4 },
            }
          }}
        >
          <div className="max-w-[1600px] w-full mx-auto">
            <Outlet />
          </div>
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
};
export default MainLayout;


