# Global Styles and CSS

This folder contains global CSS files and styling configurations used throughout the application.

## Files Description

### globals.css
**Purpose**: Global CSS styles and base styling for the entire application.

**Functionality**:
- CSS reset and normalization
- Global CSS variables and custom properties
- Base typography styles
- Layout utilities and grid systems
- Component base styles
- Animation and transition defaults
- Responsive design utilities

**Key Features**:
- CSS custom properties for theming
- Responsive typography scale
- Consistent spacing system
- Base component styles
- Animation utilities
- Dark/light theme support

**CSS Variables**:
- Color palette variables
- Typography scale variables
- Spacing system variables
- Border radius variables
- Shadow system variables
- Z-index scale variables

### fonts.css
**Purpose**: Font definitions and typography configurations.

**Functionality**:
- Font family declarations
- Font loading and optimization
- Font weight and style definitions
- Font fallback configurations
- Icon font configurations
- Web font loading strategies

**Key Features**:
- Optimized font loading
- Font fallback chains
- Icon font integration
- Font performance optimization
- Cross-browser font support

## Architecture Notes

- Global styles use CSS custom properties for theming
- Styles are organized using BEM methodology
- Typography follows a consistent scale
- Colors are defined using semantic naming
- Responsive design uses mobile-first approach
- CSS is optimized for performance

## Dependencies

- TailwindCSS for utility classes
- PostCSS for CSS processing
- Font loading libraries (if applicable)
- CSS autoprefixer for browser compatibility

## Usage Guidelines

- Import global styles in main application entry point
- Use CSS custom properties for theme consistency
- Follow established naming conventions
- Optimize font loading for performance
- Test styles across different devices and browsers
- Maintain consistent spacing and typography scales
