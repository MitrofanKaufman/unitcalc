import React from 'react';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { useTheme } from '@/lib/theme/useTheme';

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
  title?: string;
  showResetButton?: boolean;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
  title = 'Что-то пошло не так',
  showResetButton = true,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        p: theme.spacing.md,
        backgroundColor: theme.colors?.background || '#fff',
      }}
    >
      <Card
        sx={{
          maxWidth: 600,
          width: '100%',
          boxShadow: theme.shadows?.[3] || 3,
          borderRadius: theme.borderRadius || 1,
        }}
      >
        <CardContent sx={{ textAlign: 'center', p: 4 }}>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{
              color: theme.colors.error,
              marginBottom: theme.spacing.lg,
            }}
          >
            {title}
          </Typography>
          
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{
              marginBottom: theme.spacing.lg,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {error.message || 'Произошла непредвиденная ошибка'}
          </Typography>
          
          {import.meta.env?.DEV && (
            <Box
              component="pre"
              sx={{
                textAlign: 'left',
                backgroundColor: '#f5f5f5',
                p: theme.spacing.md,
                borderRadius: theme.borderRadius || 1,
                overflowX: 'auto',
                fontSize: '0.85rem',
                mb: theme.spacing.lg,
              }}
            >
              {error.stack}
            </Box>
          )}
          
          {showResetButton && (
            <Button
              variant="contained"
              color="primary"
              onClick={resetError}
              sx={{
                marginTop: theme.spacing.md,
                padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
              }}
            >
              Попробовать снова
            </Button>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
