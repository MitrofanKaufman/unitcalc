import React, { useState, useMemo } from 'react';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  useMediaQuery,
  useTheme,
  Collapse,
  CssBaseline,
  ThemeProvider,
  createTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  ExpandLess,
  ExpandMore,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { getMenuItems } from '../../config/menuConfig';
import { AnimatedHeading } from './MainLayout';
import { ProfitabilityCalculator } from '../features/profitability-calculator/ProfitabilityCalculator';

// Types and interfaces
export type UserRole = 'guest' | 'user' | 'manager' | 'admin';

export interface UserData {
  name: string;
  avatar: string;
  role: UserRole;
}

export interface MenuItemBase {
  id: string;
  text: string | React.ReactNode;
  path: string;
  icon?: React.ReactNode;
  access?: 'public' | 'authenticated' | 'admin';
  authRequired?: boolean;
  hideWhenAuth?: boolean;
  isLogout?: boolean;
  badge?: string;
  divider?: boolean;
}

export interface MenuItemWithChildren extends MenuItemBase {
  children?: MenuItem[];
}

export type MenuItem = MenuItemBase | MenuItemWithChildren;

interface ResponsiveHeaderProps {
  menuItems?: MenuItem[];
  isAuthenticated: boolean;
  user?: UserData | null;
  onLogout: () => void;
  darkMode: boolean;
  onThemeChange: () => void;
}

const ResponsiveHeader: React.FC<ResponsiveHeaderProps> = ({
  menuItems = [],
  isAuthenticated = false,
  user = null,
  onLogout = () => {},
  darkMode = false,
  onThemeChange = () => {},
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [internalDarkMode, setInternalDarkMode] = useState(darkMode);
  const [internalAuthenticated, setInternalAuthenticated] = useState(isAuthenticated);
  const [internalUser, setInternalUser] = useState<UserData | null>(user);
  const [showCalculator, setShowCalculator] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Track mobile state for responsive behavior
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Create theme based on dark mode state
  const currentTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: internalDarkMode ? 'dark' : 'light',
        },
      }),
    [internalDarkMode]
  );

  // Get filtered menu items based on user role
  const currentUserRole = internalAuthenticated ? (internalUser?.role || 'user') : 'guest';
  const itemsToRender = menuItems.length > 0 ? menuItems : getMenuItems(currentUserRole);

  const filteredMenuItems = itemsToRender.filter((item: MenuItem) => {
    if (item.hideWhenAuth && internalAuthenticated) return false;
    if (item.access === 'public') return true;
    if (item.access === 'authenticated' && internalAuthenticated) return true;
    if (item.access === 'admin' && currentUserRole === 'admin') return true;
    return false;
  });

  // Helper function to check if a menu item is active
  const isItemActive = (item: MenuItem): boolean => {
    if (item.path && location.pathname === item.path) return true;
    if ('children' in item && item.children) {
      return item.children.some(child => child.path && location.pathname === child.path);
    }
    return false;
  };

  const handleDrawerToggle = () => {
    // На мобильных устройствах переключаем мобильное меню
    // На десктопе переключаем десктопное меню
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setDesktopMenuOpen(!desktopMenuOpen);
    }
  };

  const handleLogout = () => {
    setInternalAuthenticated(false);
    setInternalUser(null);
    if (onLogout) {
      onLogout();
    }
    navigate('/');
  };

  const handleCalculatorToggle = () => {
    setShowCalculator(!showCalculator);
  };

  const handleThemeToggle = () => {
    const newDarkMode = !internalDarkMode;
    setInternalDarkMode(newDarkMode);
    if (onThemeChange) {
      onThemeChange();
    }
  };

  const handleDesktopMenuToggle = () => {
    setDesktopMenuOpen(!desktopMenuOpen);
  };

  const handleClick = (itemId: string) => {
    setExpandedItems(prev => {
      const isCurrentlyExpanded = prev[itemId] || false;
      const newExpandedItems: Record<string, boolean> = {};

      // Если элемент не развернут, развернуть его и свернуть все остальные
      if (!isCurrentlyExpanded) {
        // Найти все элементы с детьми для свертывания
        filteredMenuItems.forEach(item => {
          if ('children' in item && item.children && item.children.length > 0) {
            newExpandedItems[item.id] = item.id === itemId;
          }
        });
      }
      // Если элемент развернут, просто свернуть его (оставить остальные как есть)

      return newExpandedItems;
    });
  };

  const handleMenuItemClick = (item: MenuItem, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if ('children' in item && item.children) {
      handleClick(item.id);
    } else if (item.path) {
      // Collapse all expanded items when navigating to a new section
      setExpandedItems({});
      navigate(item.path);
      setMobileOpen(false);
    } else if (item.isLogout) {
      // Collapse all expanded items on logout
      setExpandedItems({});
      handleLogout();
      setMobileOpen(false);
    }
  };

  const renderMenuItems = (items: MenuItem[]) => {
    return items.map((item) => {
      const hasChildren = 'children' in item && item.children && item.children.length > 0;
      const isExpanded = expandedItems[item.id] || false;
      const itemText = typeof item.text === 'string' ? item.text : '';
      const iconElement = item.icon ? (
        React.isValidElement(item.icon) ? item.icon : <span>{String(item.icon)}</span>
      ) : null;
      const expandIcon = hasChildren ? (isExpanded ? <ExpandLess /> : <ExpandMore />) : null;

      return (
        <React.Fragment key={item.id}>
          <ListItemButton
            onClick={(e) => handleMenuItemClick(item, e)}
            sx={{
              minHeight: 48,
              justifyContent: 'initial',
              px: 3, // Blue space (increased from 2.5)
              '&:not(:last-child)': {
                mb: 1.5, // Green space between items (3/2 = 1.5)
              },
              backgroundColor: isItemActive(item) ? theme.palette.primary.main : 'transparent',
              color: isItemActive(item) ? theme.palette.primary.contrastText : 'inherit',
              '&:hover': {
                backgroundColor: isItemActive(item) ? theme.palette.primary.dark : theme.palette.action.hover,
              },
              '&.Mui-selected': {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
              },
            }}
            component="div"
          >
            {iconElement && (
              <ListItemIcon sx={{ 
                mr: 3, // Red space (equal to blue space)
                justifyContent: 'center',
                color: 'inherit',
              }}>
                {iconElement}
              </ListItemIcon>
            )}
            <ListItemText 
              primary={itemText} 
              primaryTypographyProps={{
                sx: {
                  fontSize: '0.9rem',
                  fontWeight: 500,
                }
              }}
            />
            {expandIcon}
          </ListItemButton>
          
          {hasChildren && (
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{
                pl: 2, // Indent for submenu
                '& .MuiListItemButton-root': {
                  pl: 5, // Adjust submenu item padding
                  '& .MuiListItemIcon-root': {
                    minWidth: 36, // Reduce icon size in submenu
                  },
                  '& .MuiListItemText-primary': {
                    fontSize: '0.85rem', // Slightly smaller text in submenu
                  }
                }
              }}>
                {renderMenuItems(('children' in item ? item.children : []) || [])}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      );
    });
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <AnimatedHeading variant="h6" noWrap className="fade-out" sx={{ flexGrow: 1 }}>
              Marketplace Calculator
            </AnimatedHeading>
          </Toolbar>
        </AppBar>
      
      {/* Mobile Menu */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
          disableEnforceFocus: true, // Позволяет фокусироваться на элементах внутри Drawer
          disableAutoFocus: true, // Предотвращает автоматическую фокусировку на первом элементе
          disableRestoreFocus: true, // Предотвращает возврат фокуса после закрытия
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            '& .theme-toggle-container': {
              mt: 'auto',
              p: 2,
              '& .MuiIconButton-root': {
                width: '100%',
                justifyContent: 'center',
                backgroundColor: 'transparent',
                border: 'none',
                '&:hover': {
                  backgroundColor: 'action.hover',
                }
              }
            }
          },
        }}
      >
        <Box className="theme-toggle-container">
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleThemeToggle();
            }}
            color="inherit"
          >
            {internalDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </Drawer>

      {/* Desktop Menu */}
      <Drawer
        variant="permanent"
        open={desktopMenuOpen}
        onClose={handleDesktopMenuToggle}
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 240,
            position: 'relative',
            height: '100vh',
            borderRight: 'none',
            backgroundColor: theme.palette.background.default,
            // Убедимся, что Drawer не скрыт от скринридеров
            '&[role="presentation"]': {
              '&[aria-hidden="true"]': {
                display: 'block',
                position: 'relative',
                visibility: 'visible',
              },
            },
          },
        }}
        aria-label="Боковое меню"
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <List sx={{ flexGrow: 1 }}>
            {renderMenuItems(filteredMenuItems)}
          </List>
          {/* Theme toggle button at bottom */}
          <Box sx={{ mt: 'auto', p: 2 }}>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleThemeToggle();
              }}
              color="inherit"
              sx={{
                width: '100%',
                justifyContent: 'center',
                backgroundColor: 'transparent',
                border: 'none',
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
                '& .MuiIconButton-root': {
                  backgroundColor: 'transparent',
                  border: 'none',
                }
              }}
            >
              {internalDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
        </Box>
      </Drawer>

      {/* Calculator Component */}
      {showCalculator && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
          onClick={() => setShowCalculator(false)}
        >
          <Box
            sx={{
              backgroundColor: 'background.paper',
              borderRadius: 2,
              maxWidth: '90vw',
              maxHeight: '90vh',
              overflow: 'auto',
              p: 2,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <ProfitabilityCalculator />
          </Box>
        </Box>
      )}
      </Box>
    </ThemeProvider>
  );
};

export default ResponsiveHeader;
