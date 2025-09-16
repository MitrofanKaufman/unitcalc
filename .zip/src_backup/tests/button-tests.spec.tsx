// path: src/tests/button-tests.spec.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, test, describe, vi } from 'vitest';
import { test, expect } from '@playwright/test';

// Import components that contain buttons
import ProductCard from '@/pages/product/ProductCard';
import { NeuButton } from '@/ui-neu/neu-button';

// Mock data for testing
const mockProduct = {
  id: '1',
  title: 'Test Product',
  price: 1000,
  rating: 4.5,
  reviewCount: 100,
  articleId: '12345',
  images: ['test.jpg'],
  category: 'Test Category',
  brand: 'Test Brand',
};

describe('Button Component Tests', () => {
  test('NeuButton renders with default props', () => {
    render(<NeuButton>Test Button</NeuButton>);
    const button = screen.getByRole('button', { name: /test button/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('neu-button');
  });

  test('NeuButton handles click events', () => {
    const handleClick = vi.fn();
    render(<NeuButton onClick={handleClick}>Click Me</NeuButton>);
    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('NeuButton shows loading state', () => {
    render(<NeuButton isLoading>Loading</NeuButton>);
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('animate-spin');
  });

  test('ProductCard action buttons work correctly', () => {
    const mockOnViewDetails = vi.fn();
    const mockOnAddToFavorites = vi.fn();
    
    render(
      <MemoryRouter>
        <ProductCard 
          product={mockProduct} 
          onViewDetails={mockOnViewDetails}
          onAddToFavorites={mockOnAddToFavorites}
          isDark={false}
        />
      </MemoryRouter>
    );

    // Test view details button
    const viewButton = screen.getByLabelText(/просмотреть детали/i);
    fireEvent.click(viewButton);
    expect(mockOnViewDetails).toHaveBeenCalledTimes(1);

    // Test favorite button
    const favoriteButton = screen.getByLabelText(/добавить в избранное/i);
    fireEvent.click(favoriteButton);
    expect(mockOnAddToFavorites).toHaveBeenCalledTimes(1);
  });

  test('Button variants render correctly', () => {
    const { rerender } = render(<NeuButton variant="primary">Primary</NeuButton>);
    expect(screen.getByRole('button')).toHaveClass('neu-button--primary');

    rerender(<NeuButton variant="accent">Accent</NeuButton>);
    expect(screen.getByRole('button')).toHaveClass('neu-button--accent');

    rerender(<NeuButton variant="glass">Glass</NeuButton>);
    expect(screen.getByRole('button')).toHaveClass('neu-button--glass');
  });

  test('Button sizes render correctly', () => {
    const { rerender } = render(<NeuButton size="sm">Small</NeuButton>);
    expect(screen.getByRole('button')).toHaveClass('h-9');

    rerender(<NeuButton size="lg">Large</NeuButton>);
    expect(screen.getByRole('button')).toHaveClass('h-12');
  });

  test('Icon buttons have proper accessibility attributes', () => {
    render(<NeuButton size="icon" aria-label="Settings"><span>⚙️</span></NeuButton>);
    const button = screen.getByRole('button', { name: /settings/i });
    expect(button).toBeInTheDocument();
  });
});
