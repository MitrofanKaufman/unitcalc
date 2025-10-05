import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Checkbox,
  IconButton,
  Box,
  Typography,
  Skeleton,
} from '@mui/material';
import {
  Edit as EditIcon,
  // Delete as DeleteIcon,
  // Visibility as ViewIcon,
} from '@mui/icons-material';

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
export function DataTable<T extends { id: string | number } & Record<string, string | number | boolean | null | undefined>>({
  data,
  columns,
  loading = false,
  selectable = false,
  selected = [],
  onSelectionChange,
  actions = [],
  pagination,
  emptyMessage = "Нет данных для отображения",
  title
}: DataTableProps<T>) {

  // Обработчик выбора элемента
  const handleSelect = (item: T) => {
    if (!selectable || !onSelectionChange) return;

    const isSelected = selected.some(selectedItem => selectedItem.id === item.id);
    if (isSelected) {
      onSelectionChange(selected.filter(selectedItem => selectedItem.id !== item.id));
    } else {
      onSelectionChange([...selected, item]);
    }
  };

  // Обработчик выбора всех элементов
  const handleSelectAll = () => {
    if (!selectable || !onSelectionChange) return;

    if (selected.length === data.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(data);
    }
  };

  // Проверка, выбран ли элемент
  const isSelected = (item: T) => {
    return selected.some(selectedItem => selectedItem.id === item.id);
  };

  // Проверка, выбраны ли все элементы
  const isAllSelected = data.length > 0 && selected.length === data.length;

  // Скелетон строки для загрузки
  const SkeletonRow = () => (
    <TableRow>
      {columns.map((_, index) => (
        <TableCell key={index}>
          <Skeleton variant="text" width="80%" />
        </TableCell>
      ))}
      {actions.length > 0 && <TableCell><Skeleton variant="rectangular" width={120} height={36} /></TableCell>}
    </TableRow>
  );

  return (
    <Paper elevation={2}>
      {title && (
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6">{title}</Typography>
        </Box>
      )}

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < data.length}
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell
                  key={String(column.key)}
                  align={column.align || 'left'}
                  sx={{ width: column.width }}
                >
                  {column.label}
                </TableCell>
              ))}
              {actions.length > 0 && (
                <TableCell align="center">Действия</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              // Скелетон для загрузки
              Array.from({ length: pagination?.pageSize || 10 }).map((_, index) => (
                <SkeletonRow key={index} />
              ))
            ) : data.length === 0 ? (
              // Пустое состояние
              <TableRow>
                <TableCell
                  colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)}
                  align="center"
                  sx={{ py: 6 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              // Данные
              data.map((item) => (
                <TableRow
                  key={item.id}
                  hover
                  selected={selectable && isSelected(item)}
                  onClick={() => selectable && handleSelect(item)}
                  sx={{
                    cursor: selectable ? 'pointer' : 'default',
                    '&:last-child td, &:last-child th': { border: 0 }
                  }}
                >
                  {selectable && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected(item)}
                        onChange={() => handleSelect(item)}
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell key={String(column.key)} align={column.align || 'left'}>
                      {column.render
                        ? column.render(item[column.key], item)
                        : <span>{/* @ts-expect-error */ item[column.key]?.toString() ?? ''}</span>
                      }
                    </TableCell>
                  ))}
                  {actions.length > 0 && (
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                        {actions.map((action, index) => {
                          if (action.hidden && action.hidden(item)) return null;

                          return (
                            <IconButton
                              key={index}
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                action.onClick(item);
                              }}
                              disabled={action.disabled && action.disabled(item)}
                              color={action.color}
                            >
                              {React.isValidElement(action.icon) ? action.icon : <EditIcon />}
                            </IconButton>
                          );
                        })}
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Пагинация */}
      {pagination && data.length > 0 && (
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={pagination.total}
          rowsPerPage={pagination.pageSize}
          page={pagination.page}
          onPageChange={(e, page) => pagination.onChange(page, pagination.pageSize)}
          onRowsPerPageChange={(_) => pagination.onChange(0, Number((document.querySelector('[name="rowsPerPage"]') as HTMLInputElement)?.value || 10))}
          labelRowsPerPage="Строк на странице:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} из ${count !== -1 ? count : `более ${to}`}`
          }
        />
      )}
    </Paper>
  );
}

export default DataTable;
