import * as React from 'react';
import { Home as HomeIcon } from '@mui/icons-material';
import { Box, Typography, Breadcrumbs, Link, Button, Tooltip } from '@mui/material';

// Define a more specific type for ReactNode that excludes problematic types
type SafeReactNode = Exclude<React.ReactNode, bigint | boolean | null | undefined>;

export interface BreadcrumbItem {
  label: string | SafeReactNode;
  href?: string;
  to?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export interface PageHeaderAction {
  label: string | SafeReactNode;
  icon?: SafeReactNode;
  onClick?: () => void;
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'primary' | 'secondary' | 'error' | 'success' | 'info' | 'warning';
  tooltip?: string;
  disabled?: boolean;
}

export interface PageHeaderProps {
  title: SafeReactNode;
  subtitle?: SafeReactNode;
  breadcrumbs?: BreadcrumbItem[];
  actions?: PageHeaderAction[];
  children?: SafeReactNode;
}

/**
 * Стандартизированный заголовок страницы с действиями и навигацией
{{ ... }}
 * @returns JSX элемент заголовка страницы
 */
export function PageHeader({
  title,
  subtitle,
  breadcrumbs = [],
  actions = [],
  children
}: PageHeaderProps): React.ReactElement {
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
              {breadcrumb.href ? (
                <Link 
                  underline="hover" 
                  color="inherit" 
                  href={breadcrumb.href}
                  onClick={breadcrumb.onClick}
                >
                  {typeof breadcrumb.label === 'string' ? (
                    <Typography component="span" color="text.primary">
                      {breadcrumb.label}
                    </Typography>
                  ) : (
                    <span>{breadcrumb.label as any}</span>
                  )}
                </Link>
              ) : (
                <Typography component="span" color="text.primary">
                  {breadcrumb.label as any}
                </Typography>
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
            {title as any}
          </Typography>
          {subtitle && (
            <Typography variant="subtitle1" component="div" color="text.secondary">
              {subtitle as any}
            </Typography>
          )}
        </Box>

        {/* Действия */}
        {actions.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {actions.map((action, index) => (
              <Tooltip key={index} title={action.tooltip || action.label}>
                <Button
                  variant={action.variant || 'contained'}
                  color={action.color || 'primary'}
                  startIcon={action.icon}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  size="medium"
                >
                  {action.label as any}
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
