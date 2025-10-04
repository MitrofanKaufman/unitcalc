import React, { useState } from 'react';
import { Box, Paper, Typography, IconButton, Collapse, Button, Divider } from '@mui/material';
import {
  Bug,
  ChevronDown,
  ChevronUp,
  Info,
  AlertTriangle,
  X,
  RefreshCw,
  Activity
} from 'lucide-react';
import { useDebug } from './DebugContext';
import { useTheme } from '../theme/useTheme';

interface DebugPanelProps {
  position?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
}

export const DebugPanel: React.FC<DebugPanelProps> = ({
  position = 'bottom-right'
}) => {
  const { isDebugMode, toggleDebug, info } = useDebug();
  const [isExpanded, setIsExpanded] = useState(false);
  const [logs, setLogs] = useState<Array<{
    id: string;
    type: 'log' | 'error' | 'warn' | 'info';
    message: string;
    data?: any;
    timestamp: Date;
  }>>([]);

  const theme = useTheme();

  // Перехватываем console методы для отображения в панели
  React.useEffect(() => {
    if (!isDebugMode) return;

    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalInfo = console.info;

    console.log = (...args) => {
      originalLog(...args);
      const message = args.join(' ');
      setLogs(prev => [...prev.slice(-49), {
        id: Math.random().toString(36).substr(2, 9),
        type: 'log',
        message,
        timestamp: new Date()
      }]);
    };

    console.error = (...args) => {
      originalError(...args);
      const message = args.join(' ');
      setLogs(prev => [...prev.slice(-49), {
        id: Math.random().toString(36).substr(2, 9),
        type: 'error',
        message,
        timestamp: new Date()
      }]);
    };

    console.warn = (...args) => {
      originalWarn(...args);
      const message = args.join(' ');
      setLogs(prev => [...prev.slice(-49), {
        id: Math.random().toString(36).substr(2, 9),
        type: 'warn',
        message,
        timestamp: new Date()
      }]);
    };

    console.info = (...args) => {
      originalInfo(...args);
      const message = args.join(' ');
      setLogs(prev => [...prev.slice(-49), {
        id: Math.random().toString(36).substr(2, 9),
        type: 'info',
        message,
        timestamp: new Date()
      }]);
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      console.info = originalInfo;
    };
  }, [isDebugMode]);

  const getPositionStyles = () => {
    switch (position) {
      case 'top-right':
        return { top: 10, right: 10 };
      case 'bottom-right':
        return { bottom: 10, right: 10 };
      case 'top-left':
        return { top: 10, left: 10 };
      case 'bottom-left':
        return { bottom: 10, left: 10 };
      default:
        return { bottom: 10, right: 10 };
    }
  };

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertTriangle size={16} color="#f44336" />;
      case 'warn':
        return <AlertTriangle size={16} color="#ff9800" />;
      case 'info':
        return <Info size={16} color="#2196f3" />;
      default:
        return <Bug size={16} color="#4caf50" />;
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  if (!isDebugMode) {
    return (
      <Paper
        elevation={3}
        sx={{
          position: 'fixed',
          ...getPositionStyles(),
          p: 1,
          borderRadius: 2,
          cursor: 'pointer',
          backgroundColor: '#ff6b35',
          color: 'white',
          zIndex: 99999,
          minWidth: 50,
          minHeight: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={toggleDebug}
      >
        <Bug size={24} />
      </Paper>
    );
  }

  return (
    <Paper
      elevation={6}
      sx={{
        position: 'fixed',
        ...getPositionStyles(),
        width: 400,
        maxHeight: 600,
        borderRadius: 2,
        backgroundColor: theme.colors?.background || '#fff',
        border: `1px solid ${theme.colors?.text || '#000'}`,
        zIndex: 9999,
        overflow: 'hidden',
      }}
    >
      {/* Заголовок панели */}
      <Box
        sx={{
          p: 2,
          backgroundColor: theme.colors?.primary || '#1976d2',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Bug size={20} />
          <Typography variant="h6">Debug Panel</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            size="small"
            onClick={() => setIsExpanded(!isExpanded)}
            sx={{ color: 'white' }}
          >
            {isExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </IconButton>
          <IconButton
            size="small"
            onClick={toggleDebug}
            sx={{ color: 'white' }}
          >
            <X size={20} />
          </IconButton>
        </Box>
      </Box>

      <Collapse in={isExpanded}>
        <Box sx={{ p: 2, maxHeight: 500, overflow: 'auto' }}>
          {/* Статистика */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              📊 Статистика
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<Activity size={16} />}
                onClick={() => info('Performance check', {
                  memory: (performance as any).memory || 'Not available',
                  timing: performance.timing,
                  navigator: {
                    userAgent: navigator.userAgent,
                    platform: navigator.platform,
                    cookieEnabled: navigator.cookieEnabled,
                    onLine: navigator.onLine
                  }
                })}
              >
                Performance
              </Button>
              <Button
                size="small"
                variant="outlined"
                startIcon={<RefreshCw size={16} />}
                onClick={clearLogs}
              >
                Clear Logs
              </Button>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Логи */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              📝 Логи ({logs.length})
            </Typography>
            <Box sx={{ maxHeight: 300, overflow: 'auto', backgroundColor: '#f5f5f5', borderRadius: 1, p: 1 }}>
              {logs.length === 0 ? (
                <Typography variant="body2" color="textSecondary" sx={{ p: 2, textAlign: 'center' }}>
                  Логов пока нет
                </Typography>
              ) : (
                logs.map((logItem) => (
                  <Box
                    key={logItem.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1,
                      p: 1,
                      mb: 1,
                      backgroundColor: 'white',
                      borderRadius: 1,
                      borderLeft: `3px solid ${
                        logItem.type === 'error' ? '#f44336' :
                        logItem.type === 'warn' ? '#ff9800' :
                        logItem.type === 'info' ? '#2196f3' : '#4caf50'
                      }`
                    }}
                  >
                    {getLogIcon(logItem.type)}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {logItem.message}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {logItem.timestamp.toLocaleTimeString()}
                      </Typography>
                      {logItem.data && (
                        <details style={{ marginTop: '4px' }}>
                          <summary style={{ fontSize: '12px', cursor: 'pointer' }}>
                            Детали
                          </summary>
                          <pre style={{ fontSize: '11px', marginTop: '4px', overflow: 'auto' }}>
                            {JSON.stringify(logItem.data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </Box>
                  </Box>
                ))
              )}
            </Box>
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
};
