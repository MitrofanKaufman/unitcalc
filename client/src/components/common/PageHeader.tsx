import React from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  IconButton,
  Button,
  Tooltip,
} from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface PageHeaderAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'error';
  disabled?: boolean;
  tooltip?: string;
}

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: PageHeaderAction[];
  children?: React.ReactNode;
}

/**
 * Стандартизированный заголовок страницы с действиями и навигацией
 *
 * @param title - Основной заголовок страницы
 * @param subtitle - Подзаголовок страницы
 * @param breadcrumbs - Навигационные хлебные крошки
 * @param actions - Действия доступные на странице
 * @param children - Дополнительный контент в заголовке
 * @returns JSX элемент заголовка страницы
 */
export function PageHeader({
  title,
  subtitle,
  breadcrumbs = [],
  actions = [],
  children
}: PageHeaderProps) {
  return (
    <Box sx={{ mb: 4 }}>
      {/* Навигационные хлебные крошки */}
      {breadcrumbs.length > 0 && (
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link
            underline="hover"
            sx={{ display: 'flex', alignItems: 'center' }}
            color="inherit"
            href="/"
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Главная
          </Link>
          {breadcrumbs.map((breadcrumb, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
              {breadcrumb.icon && (
                <Box sx={{ mr: 0.5, display: 'flex', alignItems: 'center' }}>
                  {breadcrumb.icon}
                </Box>
              )}
              {breadcrumb.href ? (
                <Link underline="hover" color="inherit" href={breadcrumb.href}>
                  {breadcrumb.label}
                </Link>
              ) : (
                <Typography color="text.primary">{breadcrumb.label}</Typography>
              )}
            </Box>
          ))}
        </Breadcrumbs>
      )}

      {/* Основной заголовок */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="subtitle1" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>

        {/* Действия */}
        {actions.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {actions.map((action, index) => (
              <Tooltip key={index} title={action.tooltip || action.label}>
                <Button
                  variant={action.variant === 'secondary' ? 'outlined' : 'contained'}
                  color={action.variant === 'error' ? 'error' : 'primary'}
                  startIcon={action.icon}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  size="medium"
                >
                  {action.label}
                </Button>
              </Tooltip>
            ))}
          </Box>
        )}

        {/* Дополнительный контент */}
        {children && (
          <Box sx={{ mt: 1 }}>
            {children}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default PageHeader;
