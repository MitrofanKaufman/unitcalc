# Library Components and Utilities

This folder contains library components and utility functions that provide shared functionality across the application.

## Files Description

### theme-provider.tsx
**Purpose**: React context provider for theme management across the application.

**Functionality**:
- Provides theme context to all child components
- Manages theme state (dark/light/system)
- Handles theme persistence in localStorage
- Provides theme switching functionality
- Integrates with system theme preferences
- Exports theme utilities and hooks

**Key Features**:
- React Context API implementation
- Automatic theme persistence
- System theme detection
- Theme switching capabilities
- TypeScript support for theme types

**Usage**:
```typescript
import { ThemeProvider, useTheme } from '@/lib/theme-provider';

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
```

### utils.ts
**Purpose**: Utility functions and helper methods for common operations.

**Functionality**:
- String manipulation utilities
- Array and object helpers
- Date and time formatting
- Number formatting and conversion
- Validation utilities
- Performance optimization helpers

**Key Features**:
- Pure functions with no side effects
- Comprehensive error handling
- TypeScript type safety
- Performance optimized implementations

## Subdirectories

### utils/
Contains additional utility functions organized by category.

## Architecture Notes

- Library components are designed to be reusable
- Utilities are pure functions for predictable behavior
- Theme provider follows React Context best practices
- All functions are thoroughly tested
- TypeScript provides type safety
- Components follow accessibility guidelines

## Dependencies

- React for context provider
- TypeScript for type definitions
- Browser APIs for localStorage and system preferences

## Usage Guidelines

- Import library components using the `@/lib/` alias
- Use theme provider at the root of your component tree
- Prefer utility functions over inline implementations
- Test library functions independently
- Document complex utility functions
- Follow consistent naming conventions
