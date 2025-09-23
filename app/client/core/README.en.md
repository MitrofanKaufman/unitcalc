# Core Application Layer

This folder contains core application functionality, shared utilities, and foundational components that are used throughout the application.

## Files Description

### RouteManager.ts
**Purpose**: Centralized route management and navigation utilities.

**Functionality**:
- Defines all application routes and their configurations
- Manages route permissions and access control
- Provides route validation and error handling
- Handles dynamic route generation
- Manages route metadata and breadcrumbs
- Implements route guards and middleware

**Key Features**:
- Centralized route definitions
- Permission-based access control
- Dynamic route generation
- Route validation and sanitization
- Breadcrumb generation
- Error boundary integration

### constants.ts
**Purpose**: Application-wide constants and configuration values.

**Functionality**:
- API endpoint URLs and configurations
- Application settings and defaults
- Theme and styling constants
- Feature flags and toggles
- Environment-specific configurations
- Validation rules and limits

**Key Features**:
- Environment-based configuration
- Type-safe constants
- Centralized configuration management
- Feature flag management
- Validation constants

### messages.js
**Purpose**: Message definitions and localization strings.

**Functionality**:
- User-facing messages and labels
- Error and success messages
- Loading and status messages
- Form validation messages
- Notification and alert messages
- Internationalization strings

**Key Features**:
- Centralized message management
- Multi-language support
- Message categorization
- Dynamic message generation

### session.js
**Purpose**: Session management and user authentication state.

**Functionality**:
- User session handling and validation
- Authentication state management
- Session persistence and restoration
- Session timeout handling
- User preference storage
- Security token management

**Key Features**:
- Secure session handling
- Automatic session refresh
- User preference persistence
- Session validation
- Security token rotation

## Subdirectories

### hooks/
Contains core custom React hooks used throughout the application.

### interfaces/
Contains TypeScript interface definitions for core data structures.

### lib/
Contains core library utilities and helper functions.

### scripts/
Contains core application scripts and automation tools.

### services/
Contains core service classes and business logic.

### types/
Contains core TypeScript type definitions.

### utils/
Contains core utility functions and helpers.

## Architecture Notes

- Core functionality is separated from UI components
- Constants are environment-aware and type-safe
- Session management follows security best practices
- Route management is centralized and permission-aware
- Message management supports internationalization
- All core functionality is thoroughly tested

## Dependencies

- React for component integration
- TypeScript for type definitions
- Session storage APIs (localStorage, sessionStorage)
- Security libraries for token management
- Internationalization libraries (if applicable)

## Usage Guidelines

- Import core functionality using the `@/core/` alias
- Use constants instead of hardcoded values
- Follow session management patterns consistently
- Utilize route manager for navigation
- Use message constants for user-facing text
- Extend core functionality rather than duplicating
