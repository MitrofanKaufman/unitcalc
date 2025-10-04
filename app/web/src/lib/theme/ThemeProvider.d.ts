import React, { ReactNode } from 'react';
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
declare const ThemeContext: React.Context<Theme>;
export { ThemeContext };
export declare const useTheme: () => Theme;
interface ThemeProviderProps {
    children: ReactNode;
    theme?: Partial<Theme>;
}
export declare const ThemeProvider: React.FC<ThemeProviderProps>;
