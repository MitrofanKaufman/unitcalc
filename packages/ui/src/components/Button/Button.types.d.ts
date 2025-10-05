import { ButtonHTMLAttributes } from 'react';
export type ButtonVariant = 'primary' | 'secondary' | 'text' | 'outline';
export type ButtonSize = 'small' | 'medium' | 'large';
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * The variant of the button
     * @default 'primary'
     */
    variant?: ButtonVariant;
    /**
     * The size of the button
     * @default 'medium'
     */
    size?: ButtonSize;
    /**
     * Whether the button is disabled
     * @default false
     */
    disabled?: boolean;
    /**
     * Optional click handler
     */
    onClick?: () => void;
    /**
     * The content of the button
     */
    children: React.ReactNode;
    /**
     * Additional CSS class name
     */
    className?: string;
}
