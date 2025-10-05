import * as React from 'react';
export interface BreadcrumbItem {
    label: string | React.ReactNode;
    href?: string;
    to?: string;
    disabled?: boolean;
    onClick?: () => void;
}
export interface PageHeaderAction {
    label: string;
    icon?: React.ReactElement;
    onClick?: () => void;
    variant?: 'text' | 'outlined' | 'contained';
    color?: 'primary' | 'secondary' | 'error' | 'success' | 'info' | 'warning';
    tooltip?: string;
    disabled?: boolean;
}
export interface PageHeaderProps {
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    actions?: PageHeaderAction[];
    children?: React.ReactNode;
}
/**
 * Стандартизированный заголовок страницы с действиями и навигацией
{{ ... }}
 * @returns JSX элемент заголовка страницы
 */
export declare function PageHeader({ title, subtitle, breadcrumbs, actions, children }: PageHeaderProps): React.ReactElement;
export default PageHeader;
