import React from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { ButtonProps, ButtonVariant, ButtonSize } from './Button.types';

const getButtonStyles = ({ variant = 'primary', size = 'medium', disabled = false }: { variant?: ButtonVariant; size?: ButtonSize; disabled?: boolean }) => css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 4px;
  padding: ${size === 'large' ? '12px 24px' : size === 'small' ? '4px 8px' : '8px 16px'};
  font-size: ${size === 'large' ? '16px' : size === 'small' ? '12px' : '14px'};
  font-weight: 500;
  line-height: 1.5;
  cursor: ${disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease-in-out;

  ${variant === 'primary' && !disabled && css`
    background-color: #2563eb;
    color: white;

    &:hover {
      background-color: #1d4ed8;
    }
  `}

  ${variant === 'secondary' && !disabled && css`
    background-color: white;
    color: #2563eb;
    border: 1px solid #2563eb;

    &:hover {
      background-color: #f8fafc;
    }
  `}

  ${disabled && css`
    opacity: 0.6;
  `}
`;

const StyledButton = styled.button<{ $variant?: ButtonVariant; $size?: ButtonSize; $disabled?: boolean }>`
  ${({ $variant = 'primary', $size = 'medium', $disabled = false }) => getButtonStyles({ variant: $variant, size: $size, disabled: $disabled })}
`;

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  className,
  ...props
}) => {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $disabled={disabled}
      className={className}
      onClick={disabled ? undefined : onClick}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
