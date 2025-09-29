import React, { useState } from 'react';
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
  Collapse
} from '@mui/material';
import {
  Menu as MenuIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  ExpandLess,
  ExpandMore
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { getMenuItems } from '../../config/menuConfig';
import { AnimatedHeading } from './MainLayout';

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
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Track mobile state for responsive behavior
  useMediaQuery(theme.breakpoints.down('md'));

  // Get filtered menu items based on user role
  const currentUserRole = isAuthenticated ? (user?.role || 'user') : 'guest';
  const itemsToRender = menuItems.length > 0 ? menuItems : getMenuItems(currentUserRole);

  const filteredMenuItems = itemsToRender.filter((item: MenuItem) => {
    if (item.hideWhenAuth && isAuthenticated) return false;
    if (item.access === 'public') return true;
    if (item.access === 'authenticated' && isAuthenticated) return true;
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
    setMobileOpen(!mobileOpen);
  };

  const handleClick = (itemId: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
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
      onLogout();
      setMobileOpen(false);
      navigate('/');
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
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <AnimatedHeading variant="h6" noWrap className="fade-out" sx={{ flexGrow: 1 }}>
            Marketplace Calculator
          </AnimatedHeading>
          <IconButton onClick={onThemeChange} color="inherit">
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {renderMenuItems(filteredMenuItems)}
          </List>
        </Box>
      </Drawer>

      {/* Desktop Menu */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box',
            width: 240,
            position: 'relative',
            height: '100vh',
            borderRight: 'none',
            backgroundColor: theme.palette.background.default,
          },
        }}
        open
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {renderMenuItems(filteredMenuItems)}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default ResponsiveHeader;
