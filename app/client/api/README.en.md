# API Layer

This folder contains API-related functionality for handling external communications and data fetching in the application.

## Files Description

### api.ts
**Purpose**: Main API configuration and base API client setup.

**Functionality**:
- Configures API base URL and endpoints
- Sets up default headers and authentication
- Provides base API client instance
- Handles common API configurations
- Manages API versioning and routing

**Key Features**:
- Centralized API configuration
- Authentication token management
- Request/response interceptors
- Error handling middleware
- API versioning support

### httpClient.ts
**Purpose**: HTTP client wrapper for making API requests.

**Functionality**:
- Wraps fetch API with additional functionality
- Provides consistent request/response handling
- Implements retry logic for failed requests
- Handles authentication headers automatically
- Provides request/response logging
- Manages request timeouts and cancellations

**Key Features**:
- Automatic retry on failure
- Request/response logging
- Timeout handling
- Authentication header management
- Response caching capabilities

### productService.ts
**Purpose**: Service layer for product-related API operations.

**Functionality**:
- Product search and filtering
- Product details retrieval
- Product analytics and profitability calculations
- Cache management for product data
- Error handling for product operations

**Key Features**:
- Product search with advanced filters
- Caching strategy implementation
- Error recovery mechanisms
- Data transformation and normalization

### suggest.ts
**Purpose**: Autocomplete and suggestion functionality.

**Functionality**:
- Product name suggestions
- Search query completion
- Real-time suggestion fetching
- Suggestion ranking and filtering
- Cache management for suggestions

**Key Features**:
- Real-time search suggestions
- Debounced API calls
- Suggestion caching
- Fuzzy search support

### messages.js
**Purpose**: Message handling and internationalization.

**Functionality**:
- User-facing message management
- Error message handling
- Success message notifications
- Loading message management
- Internationalization support

**Key Features**:
- Centralized message management
- Multi-language support
- Message formatting utilities
- Toast notification integration

## Subdirectories

### db/
Contains database-related API utilities and configurations.

### n8n/
Contains N8N workflow integration and automation APIs.

### v1/
Contains version 1 API endpoints and legacy API support.

## Architecture Notes

- All API functions follow consistent patterns
- Error handling is centralized and comprehensive
- Caching strategies are implemented across services
- Authentication is handled uniformly
- Request/response transformations are standardized

## Dependencies

- Fetch API (browser standard)
- Custom HTTP client wrappers
- Caching libraries (if applicable)
- Authentication token management
- Error handling utilities

## Usage Guidelines

- Use service functions rather than direct API calls
- Implement proper error handling in consuming components
- Utilize caching for improved performance
- Follow authentication patterns consistently
- Test API functions independently
