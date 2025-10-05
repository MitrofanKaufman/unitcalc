import React from 'react';
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
}
export declare const Button: ({ children, variant, size, className, ...props }: ButtonProps) => import("react/jsx-runtime").JSX.Element;
export default Button;
