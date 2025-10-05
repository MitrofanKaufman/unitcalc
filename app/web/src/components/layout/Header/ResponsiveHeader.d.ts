import React from 'react';
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
declare const ResponsiveHeader: React.FC<ResponsiveHeaderProps>;
export default ResponsiveHeader;
