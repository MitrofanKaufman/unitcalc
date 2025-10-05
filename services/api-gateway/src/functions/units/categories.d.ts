/**
 * Получение всех доступных категорий единиц измерения
 * @returns Массив категорий с описаниями
 */
export declare const getUnitCategories: () => Promise<Array<{
    id: string;
    name: string;
    description: string;
    units: string[];
}>>;
