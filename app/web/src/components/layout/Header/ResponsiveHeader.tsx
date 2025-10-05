import React, { useCallback, useState } from 'react';
import { useTheme, Theme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  ThemeProvider,
  CssBaseline,
  Collapse,
  Divider,
  Avatar,
  Menu,
  MenuItem as MuiMenuItem
} from '@mui/material';
import {
  Menu as MenuIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  ExpandMore,
  ExpandLess,
  AccountCircle
} from '@mui/icons-material';

export type MenuItem = {
  id?: string;
  text?: string;
  title?: string;
  path: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
  access?: string;
  hideWhenAuth?: boolean;
  isLogout?: boolean;
};

export type UserData = {
  name: string;
  email: string;
  avatar?: string;
  role?: string;
};

interface ResponsiveHeaderProps {
  menuItems?: MenuItem[];
  isAuthenticated?: boolean;
  user?: UserData | null;
  onLogout?: () => void;
  darkMode?: boolean;
  onThemeChange?: () => void;
  onMenuToggle?: (open: boolean) => void;
}

const drawerWidth = 240;

const ResponsiveHeader: React.FC<ResponsiveHeaderProps> = ({
  menuItems = [],
  isAuthenticated = false,
  user,
  onLogout,
  darkMode = false,
  onThemeChange,
  onMenuToggle
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const navigate = useNavigate();

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen(!mobileOpen);
    if (onMenuToggle) {
      onMenuToggle(!mobileOpen);
    }
  }, [mobileOpen, onMenuToggle]);

  const handleDesktopMenuToggle = useCallback(() => {
    setDesktopMenuOpen(!desktopMenuOpen);
  }, [desktopMenuOpen]);

  const handleThemeToggle = useCallback(() => {
    if (onThemeChange) {
      onThemeChange();
    }
  }, [onThemeChange]);

  const handleMenuItemClick = useCallback((path: string, isLogout?: boolean) => {
    if (isLogout && onLogout) {
      onLogout();
    } else if (path) {
      navigate(path);
      setMobileOpen(false);
    }
  }, [navigate, onLogout]);

  const handleExpandClick = useCallback((itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  }, []);

  const handleProfileMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleProfileMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const renderMenuItem = useCallback((item: MenuItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id || item.path);
    const displayText = item.title || item.text || '';

    return (
      <React.Fragment key={item.id || item.path}>
        <ListItem disablePadding sx={{ pl: level * 2 }}>
          <ListItemButton
            onClick={() => {
              if (hasChildren) {
                handleExpandClick(item.id || item.path);
              } else {
                handleMenuItemClick(item.path, item.isLogout);
              }
            }}
          >
            {item.icon && (
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
            )}
            <ListItemText primary={displayText} />
            {hasChildren && (
              isExpanded ? <ExpandLess /> : <ExpandMore />
            )}
          </ListItemButton>
        </ListItem>

        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children?.map(child => renderMenuItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  }, [expandedItems, handleExpandClick, handleMenuItemClick]);

  const filteredMenuItems = menuItems.filter(item => {
    if (item.hideWhenAuth && isAuthenticated) return false;
    if (item.access === 'authenticated' && !isAuthenticated) return false;
    if (item.access === 'admin' && (!isAuthenticated || user?.role !== 'admin')) return false;
    return true;
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Marketplace Calculator
            </Typography>
            <Box sx={{ flexGrow: 1 }} />

            {/* Theme Toggle */}
            <IconButton color="inherit" onClick={handleThemeToggle}>
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>

            {/* User Menu */}
            {isAuthenticated && user && (
              <>
                <IconButton
                  color="inherit"
                  onClick={handleProfileMenuOpen}
                  sx={{ ml: 1 }}
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleProfileMenuClose}
                >
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="body2">{user.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>
                  <Divider />
                  <MuiMenuItem onClick={() => handleMenuItemClick('/profile')}>
                    Профиль
                  </MuiMenuItem>
                  <MuiMenuItem onClick={() => handleMenuItemClick('', true)}>
                    Выйти
                  </MuiMenuItem>
                </Menu>
              </>
            )}
          </Toolbar>
        </AppBar>

        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          <Box sx={{ p: 2, mt: 8 }}>
            <Typography variant="h6" gutterBottom>
              Меню
            </Typography>
            <List>
              {filteredMenuItems.map(item => renderMenuItem(item))}
            </List>
          </Box>
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          open={desktopMenuOpen}
          onClose={handleDesktopMenuToggle}
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            <List>
              {filteredMenuItems.map(item => renderMenuItem(item))}
            </List>
          </Box>
        </Drawer>
      </Box>
    </ThemeProvider>
  );
};

export default ResponsiveHeader;
