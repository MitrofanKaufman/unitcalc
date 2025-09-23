# Utility Functions

This folder contains utility functions and helper methods used throughout the application for common operations and data transformations.

## Files Description

### logger.ts
**Purpose**: Centralized logging utility for application debugging and monitoring.

**Functionality**:
- Console logging with different levels (debug, info, warn, error)
- Structured logging with metadata
- Log filtering and level management
- Production/development log handling
- Error tracking and reporting
- Performance monitoring logs

**Key Features**:
- Configurable log levels
- Structured logging with context
- Production-safe logging
- Error boundary integration
- Performance impact monitoring
- Log filtering and search

**Log Levels**:
- `DEBUG`: Detailed debugging information
- `INFO`: General information messages
- `WARN`: Warning messages for potential issues
- `ERROR`: Error messages for exceptions and failures

**Usage**:
```typescript
import { logger } from '@/utils/logger';

// Different log levels
logger.debug('Debug message', { context: 'component' });
logger.info('Info message', { userId: 123 });
logger.warn('Warning message', { issue: 'deprecated' });
logger.error('Error message', { error, stack: true });
```

## Architecture Notes

- Utilities are pure functions with no side effects
- Logger is configurable based on environment
- Functions are thoroughly tested and documented
- Utilities follow consistent naming conventions
- Error handling is built into utility functions
- Performance considerations are taken into account

## Dependencies

- Browser console API for logging
- Environment detection utilities
- Error handling libraries (if applicable)

## Usage Guidelines

- Import utilities using the `@/utils/` alias
- Use logger consistently throughout the application
- Prefer utility functions over inline code
- Document complex utility functions
- Test utility functions independently
- Consider performance implications of utility usage
