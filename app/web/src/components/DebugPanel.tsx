import React, { useState } from 'react';

// Material-UI Debug Panel компонент
const DebugPanel: React.FC<{
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}> = ({ position = 'bottom-right' }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [logs, setLogs] = useState([
    {
      id: 1,
      message: '🐛 DebugProvider initialized: [object Object]',
      timestamp: '10:54:36 AM',
      type: 'info'
    }
  ]);

  const getPositionStyles = () => {
    switch (position) {
      case 'top-right':
        return { top: '20px', right: '20px', bottom: 'auto', left: 'auto' };
      case 'top-left':
        return { top: '20px', left: '20px', bottom: 'auto', right: 'auto' };
      case 'bottom-left':
        return { bottom: '20px', left: '20px', top: 'auto', right: 'auto' };
      default: // bottom-right
        return { bottom: '20px', right: '20px', top: 'auto', left: 'auto' };
    }
  };

  const addLog = (message: string, type: 'info' | 'error' | 'warning' = 'info') => {
    const newLog = {
      id: Date.now(),
      message,
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }),
      type
    };
    setLogs(prev => [newLog, ...prev.slice(0, 9)]); // Keep only last 10 logs
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'error':
        return '🔴';
      case 'warning':
        return '🟡';
      default:
        return '🔵';
    }
  };

  if (!isOpen) {
    return (
      <div
        className="debug-panel-toggle"
        style={{
          position: 'fixed',
          ...getPositionStyles(),
          zIndex: 9999,
          background: '#1976d2',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '12px',
          boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)'
        }}
        onClick={() => setIsOpen(true)}
      >
        🐛 Debug
      </div>
    );
  }

  return (
    <div
      className="debug-panel"
      style={{
        position: 'fixed',
        ...getPositionStyles(),
        width: '400px',
        maxHeight: '600px',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px',
          borderBottom: '1px solid #e0e0e0'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: '#1976d2' }}
          >
            <path d="m8 2 1.88 1.88"></path>
            <path d="M14.12 3.88 16 2"></path>
            <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"></path>
            <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"></path>
            <path d="M12 20v-9"></path>
            <path d="M6.53 9C4.6 8.8 3 7.1 3 5"></path>
            <path d="M6 13H2"></path>
            <path d="M3 21c0-2.1 1.7-3.9 3.8-4"></path>
            <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"></path>
            <path d="M22 13h-4"></path>
            <path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"></path>
          </svg>
          <h6 style={{
            margin: 0,
            fontSize: '16px',
            fontWeight: 600,
            color: '#1976d2'
          }}>
            Debug Panel
          </h6>
        </div>

        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m18 15-6-6-6 6"></path>
            </svg>
          </button>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Statistics Section */}
        <div style={{ padding: '16px', borderBottom: '1px solid #e0e0e0' }}>
          <h6 style={{
            margin: '0 0 8px 0',
            fontSize: '14px',
            fontWeight: 600,
            color: '#666'
          }}>
            📊 Статистика
          </h6>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => addLog('📊 Performance metrics updated', 'info')}
              style={{
                background: '#e3f2fd',
                border: '1px solid #1976d2',
                color: '#1976d2',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
              Performance
            </button>
            <button
              onClick={clearLogs}
              style={{
                background: '#fff3e0',
                border: '1px solid #f57c00',
                color: '#f57c00',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                <path d="M21 3v5h-5"></path>
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                <path d="M8 16H3v5"></path>
              </svg>
              Clear Logs
            </button>
          </div>
        </div>

        {/* Logs Section */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px 16px 8px 16px', borderBottom: '1px solid #e0e0e0' }}>
            <h6 style={{
              margin: 0,
              fontSize: '14px',
              fontWeight: 600,
              color: '#666'
            }}>
              📝 Логи ({logs.length})
            </h6>
          </div>

          <div style={{
            flex: 1,
            overflow: 'auto',
            padding: '8px 16px'
          }}>
            {logs.map(log => (
              <div
                key={log.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  marginBottom: '8px',
                  padding: '8px',
                  background: '#f5f5f5',
                  borderRadius: '4px'
                }}
              >
                <span style={{ fontSize: '14px' }}>{getLogIcon(log.type)}</span>
                <div style={{ flex: 1 }}>
                  <p style={{
                    margin: 0,
                    fontSize: '13px',
                    color: '#333',
                    lineHeight: 1.4
                  }}>
                    {log.message}
                  </p>
                  <span style={{
                    fontSize: '11px',
                    color: '#666'
                  }}>
                    {log.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugPanel;
