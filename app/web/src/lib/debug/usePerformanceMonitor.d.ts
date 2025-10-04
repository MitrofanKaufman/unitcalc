interface PerformanceMetrics {
    fps: number;
    memoryUsage: number;
    renderTime: number;
    componentCount: number;
}
export declare const usePerformanceMonitor: () => {
    metrics: PerformanceMetrics;
    measureRenderTime: (componentName: string, renderStart: number) => void;
    logPerformanceIssue: (issue: string, data?: any) => void;
};
export {};
