import React from 'react';
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
    inputRef?: React.Ref<HTMLInputElement>;
    placeholder?: string;
    onSearch: (query: string, filters?: Record<string, string | string[]>) => void;
    filters?: FilterConfig[];
    showAdvanced?: boolean;
    initialQuery?: string;
    initialFilters?: Record<string, string | string[]>;
    value?: string;
    onChange?: (value: string) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    sx?: any;
    inputProps?: any;
    InputProps?: any;
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
export declare const SearchBar: React.FC<SearchBarProps>;
export default SearchBar;
