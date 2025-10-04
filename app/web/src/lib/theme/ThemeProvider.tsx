import React, { createContext, useContext, ReactNode, useMemo } from 'react';

type Theme = {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    error: string;
    warning: string;
    success: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: string;
  shadows: string[];
};

const defaultTheme: Theme = {
  colors: {
    primary: '#2563eb',
    secondary: '#7c3aed',
    background: '#ffffff',
    text: '#1f2937',
    error: '#dc2626',
    warning: '#d97706',
    success: '#059669',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  borderRadius: '0.375rem',
  shadows: [
    'none',
    '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  ],
};

const ThemeContext = createContext<Theme>(defaultTheme);

export { ThemeContext };

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
  theme?: Partial<Theme>;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  theme: customTheme,
}) => {
  const theme = useMemo(
    () => ({
      ...defaultTheme,
      ...customTheme,
      colors: {
        ...defaultTheme.colors,
        ...customTheme?.colors,
      },
      spacing: {
        ...defaultTheme.spacing,
        ...customTheme?.spacing,
      },
    }),
    [customTheme]
  );

  return (
    <ThemeContext.Provider value={theme}>
      <div style={{ color: theme.colors.text, backgroundColor: theme.colors.background }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
