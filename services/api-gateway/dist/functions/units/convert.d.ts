/**
 * Конвертация между единицами измерения
 * @param from Исходная единица
 * @param to Целевая единица
 * @param value Значение для конвертации
 * @returns Результат конвертации
 */
export declare const convertUnits: (from: string, to: string, value: number) => Promise<{
    result: number;
    from: string;
    to: string;
    formula?: string;
}>;
//# sourceMappingURL=convert.d.ts.map