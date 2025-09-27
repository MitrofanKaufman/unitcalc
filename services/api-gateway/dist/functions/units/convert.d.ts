export declare const convertUnits: (from: string, to: string, value: number) => Promise<{
    result: number;
    from: string;
    to: string;
    formula?: string;
}>;
