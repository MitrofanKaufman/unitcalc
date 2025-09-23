# Layout Components

This folder contains React components related to layouts that define the overall structure and navigation of the application.

## Files Description

### Layout.tsx
**Purpose**: Main application layout component that provides the overall page structure.

**Functionality**:
- Wraps the entire application with consistent layout structure
- Manages theme state (dark/light mode)
- Integrates with React Router for navigation
- Provides outlet for nested routes
- Handles Telegram integration when available
- Applies theme classes to document root
- Manages layout state and responsive behavior

**Key Features**:
- Theme management with ThemeManager integration
- Responsive design considerations
- Outlet for dynamic content rendering
- Telegram Web App integration support

### Header.tsx
**Purpose**: Header component that provides navigation and branding elements.

**Functionality**:
- Displays application logo and branding
- Contains navigation menu items
- Theme toggle button integration
- Responsive navigation for mobile devices
- Search functionality (if applicable)
- User account/profile access

**Key Features**:
- Responsive design with mobile menu
- Theme toggle integration
- Navigation state management
- Accessibility features

### Menu.tsx
**Purpose**: Navigation menu component for application navigation.

**Functionality**:
- Provides navigation links to different sections
- Handles menu state (open/closed)
- Mobile-friendly navigation
- Integration with React Router
- Active route highlighting
- Collapsible menu functionality

**Key Features**:
- Responsive navigation
- Active route detection
- Smooth animations for menu interactions
- Accessibility compliance

## Architecture Notes

- All layout components follow React functional component patterns
- Components are designed to be reusable across different pages
- Theme integration is consistent across all layout components
- Components support both desktop and mobile layouts
- Proper TypeScript typing for all props and state

## Dependencies

- React Router for navigation functionality
- ThemeManager for theme state management
- Telegram Web App SDK for Telegram integration
- Lucide React for icons
