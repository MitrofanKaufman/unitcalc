import { Moon, Sun } from 'lucide-react';
import React from 'react';

import { Button } from '../../../../../app/client/components/ui/button';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  isDark,
  onToggle,
  className = '',
}) => (
  <Button
    variant="ghost"
    size="icon"
    onClick={onToggle}
    aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    className={className}
  >
    {isDark ? (
      <Sun className="h-5 w-5" />
    ) : (
      <Moon className="h-5 w-5" />
    )}
  </Button>
);
