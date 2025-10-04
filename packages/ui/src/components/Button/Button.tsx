import React from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { ButtonProps } from './Button.types';

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  ${({ variant = 'primary' }) => 
    variant === 'primary' && 
    css`
      background-color: #2563eb;
      color: white;
      
      &:hover {
        background-color: #1d4ed8;
      }
      
      &:disabled {
        background-color: #93c5fd;
        cursor: not-allowed;
      }
    `}
    
  ${({ variant }) => 
    variant === 'secondary' && 
    css`
      background-color: white;
      color: #2563eb;
      border: 1px solid #2563eb;
      
      &:hover {
        background-color: #f8fafc;
      }
      
      &:disabled {
        color: #93c5fd;
        border-color: #93c5fd;
        cursor: not-allowed;
      }
    `}
    
  ${({ size = 'medium' }) => 
    size === 'large' && 
    css`
      padding: 12px 24px;
      font-size: 16px;
    `}
    
  ${({ size }) => 
    size === 'small' && 
    css`
      padding: 4px 8px;
      font-size: 12px;
    `}
`;

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
