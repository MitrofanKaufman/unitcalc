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
  Typography,
  useMediaQuery,
  useTheme,
  styled,
  Collapse
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Brightness4 as Brightness4Icon, 
  Brightness7 as Brightness7Icon,
  ExpandLess,
  ExpandMore
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Types and interfaces
export type UserRole = 'user' | 'admin';

export interface UserData {
  name: string;
  avatar: string;
  role: UserRole;
}

export interface MenuItemBase {
  id: string;
  text: string | React.ReactNode;
  path: string;
  icon?: string | React.ReactNode;
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

// Styled components
const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

interface ResponsiveHeaderProps {
  menuItems: MenuItem[];
  isAuthenticated: boolean;
  user?: UserData | null;
  onLogout: () => void;
  darkMode: boolean;
  onThemeChange: () => void;
}

const ResponsiveHeader: React.FC<ResponsiveHeaderProps> = ({
  menuItems,
  isAuthenticated,
  user,
  onLogout,
  darkMode,
  onThemeChange,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const theme = useTheme();
  useMediaQuery(theme.breakpoints.down('md')); // Track mobile state but don't use it yet
  const navigate = useNavigate();
  
  // Filter menu items based on authentication status
  const filteredMenuItems = menuItems.filter(item => {
    if (item.hideWhenAuth && isAuthenticated) return false;
    if (item.authRequired && !isAuthenticated) return false;
    if (item.isLogout && !isAuthenticated) return false;
    return true;
  });

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
      navigate(item.path);
      setMobileOpen(false);
    } else if (item.isLogout) {
      onLogout();
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
              px: 2.5,
            }}
            component="div"
          >
            {iconElement && (
              <ListItemIcon sx={{ minWidth: 0, mr: 2, justifyContent: 'center' }}>
                {iconElement}
              </ListItemIcon>
            )}
            <ListItemText primary={itemText} />
            {expandIcon}
          </ListItemButton>
          
          {hasChildren && (
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
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
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            WB Calculator
          </Typography>
          <IconButton onClick={onThemeChange} color="inherit">
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
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
