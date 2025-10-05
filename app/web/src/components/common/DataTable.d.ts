import React from 'react';
export interface TableColumn<T> {
    key: keyof T;
    label: string;
    render?: (value: any, item: T) => React.ReactNode;
    sortable?: boolean;
    width?: number | string;
    align?: 'left' | 'center' | 'right';
}
export interface TableAction<T> {
    label: string;
    icon?: React.ReactNode;
    onClick: (item: T) => void;
    color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
    disabled?: (item: T) => boolean;
    hidden?: (item: T) => boolean;
}
export interface DataTableProps<T> {
    data: T[];
    columns: TableColumn<T>[];
    loading?: boolean;
    selectable?: boolean;
    selected?: T[];
    onSelectionChange?: (selected: T[]) => void;
    actions?: TableAction<T>[];
    pagination?: {
        page: number;
        pageSize: number;
        total: number;
        onChange: (page: number, pageSize: number) => void;
    };
    emptyMessage?: string;
    title?: string;
}
/**
 * Стандартизированная таблица данных с пагинацией и действиями
 *
 * @param data - Массив данных для отображения
 * @param columns - Конфигурация колонок таблицы
 * @param loading - Состояние загрузки данных
 * @param selectable - Включить множественный выбор
 * @param selected - Выбранные элементы
 * @param onSelectionChange - Обработчик изменения выбора
 * @param actions - Действия для каждой строки
 * @param pagination - Конфигурация пагинации
 * @param emptyMessage - Сообщение при отсутствии данных
 * @param title - Заголовок таблицы
 * @returns JSX элемент таблицы данных
 */
export declare function DataTable<T extends {
    id: string | number;
} & Record<string, string | number | boolean | null | undefined>>({ data, columns, loading, selectable, selected, onSelectionChange, actions, pagination, emptyMessage, title }: DataTableProps<T>): import("react/jsx-runtime").JSX.Element;
export default DataTable;
