import React, { useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Collapse,
  Paper,
  Typography,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
  defaultValue?: string;
  multiple?: boolean;
}

export interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string, filters: Record<string, string | string[]>) => void;
  filters?: FilterConfig[];
  showAdvanced?: boolean;
  initialQuery?: string;
  initialFilters?: Record<string, string | string[]>;
}

/**
 * Стандартизированная поисковая панель с фильтрами
 *
 * @param placeholder - Плейсхолдер для поля поиска
 * @param onSearch - Функция вызываемая при поиске
 * @param filters - Конфигурация фильтров
 * @param showAdvanced - Показывать расширенные фильтры
 * @param initialQuery - Начальный поисковый запрос
 * @param initialFilters - Начальные значения фильтров
 * @returns JSX элемент поисковой панели
 */
export function SearchBar({
  placeholder = "Поиск...",
  onSearch,
  filters = [],
  showAdvanced = false,
  initialQuery = '',
  initialFilters = {}
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [activeFilters, setActiveFilters] = useState<Record<string, string | string[]>>(initialFilters);
  const [showFilters, setShowFilters] = useState(showAdvanced);

  // Обработчик поиска
  const handleSearch = () => {
    onSearch(query, activeFilters);
  };

  // Обработчик изменения поискового запроса
  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  // Обработчик нажатия Enter в поле поиска
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  // Обработчик изменения фильтра
  const handleFilterChange = (filterKey: string, value: string | string[]) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  // Очистка всех фильтров и поиска
  const clearAll = () => {
    setQuery('');
    setActiveFilters({});
    onSearch('', {});
  };

  // Проверка наличия активных фильтров
  const hasActiveFilters = Object.keys(activeFilters).length > 0 || query.length > 0;

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Поле поиска */}
        <TextField
          fullWidth
          placeholder={placeholder}
          value={query}
          onChange={handleQueryChange}
          onKeyPress={handleKeyPress}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: query && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setQuery('')}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 300, flex: 1 }}
        />

        {/* Кнопки действий */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            onClick={handleSearch}
            startIcon={<SearchIcon />}
            sx={{
              background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1565c0 30%, #17a2b8 90%)',
              }
            }}
          >
            Поиск
          </Button>

          {filters.length > 0 && (
            <Button
              variant="outlined"
              onClick={() => setShowFilters(!showFilters)}
              startIcon={showFilters ? <ExpandLessIcon /> : <FilterIcon />}
            >
              Фильтры
            </Button>
          )}

          {hasActiveFilters && (
            <Button
              variant="text"
              onClick={clearAll}
              startIcon={<ClearIcon />}
              color="error"
            >
              Очистить
            </Button>
          )}
        </Box>
      </Box>

      {/* Расширенные фильтры */}
      {filters.length > 0 && (
        <Collapse in={showFilters}>
          <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" gutterBottom>
              Фильтры поиска:
            </Typography>

            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fit, minmax(200px, 1fr))' },
              gap: 2
            }}>
              {filters.map((filter) => (
                <FormControl key={filter.key} fullWidth>
                  <InputLabel>{filter.label}</InputLabel>
                  <Select
                    value={activeFilters[filter.key] || (filter.multiple ? [] : '')}
                    label={filter.label}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    multiple={filter.multiple}
                  >
                    <MenuItem value="">
                      <em>Все</em>
                    </MenuItem>
                    {filter.options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ))}
            </Box>
          </Box>
        </Collapse>
      )}
    </Paper>
  );
}

export default SearchBar;
