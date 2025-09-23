# Custom React Hooks

This folder contains custom React hooks that encapsulate complex logic and state management for the application.

## Files Description

### useProductSearch.ts
**Purpose**: Custom hook for managing product search functionality and state.

**Functionality**:
- Manages search query state and results
- Handles product search API calls with React Query
- Provides autocomplete/suggestion functionality
- Implements search debouncing for performance
- Manages loading states and error handling
- Supports pagination and infinite scroll
- Provides keyboard navigation for suggestions

**Key Features**:
- React Query integration for caching and background updates
- Debounced search to prevent excessive API calls
- Comprehensive error handling and loading states
- Keyboard accessibility for suggestions
- TypeScript interfaces for type safety
- Configurable search options (limit, filters, sorting)

**State Management**:
- `query`: Current search query string
- `results`: Array of search results
- `isLoading`: Loading state indicator
- `error`: Error message if search fails
- `hasSearched`: Boolean indicating if search has been performed

**Methods**:
- `updateQuery(query: string)`: Updates search query
- `performSearch(options?)`: Executes search with optional parameters
- `clearSearch()`: Clears current search results
- `selectProduct(product)`: Selects a product from results
- `refetchSearch()`: Refetches current search results

**Dependencies**:
- React Query for server state management
- TypeScript interfaces for type safety
- Custom search API functions

## Architecture Notes

- Hooks follow React best practices for custom hooks
- State management is isolated to hook scope
- Error boundaries and loading states are properly handled
- Hooks are designed to be reusable across components
- TypeScript provides type safety for all hook interfaces
- Proper cleanup and memory management

## Usage Guidelines

- Import hooks using the `@/hooks/` alias
- Always handle loading and error states in consuming components
- Use TypeScript interfaces for type safety
- Consider performance implications of hook usage
- Test hooks independently when possible
