import React, { useEffect, useState, useCallback } from 'react';
import { useDebug } from './DebugContext';

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  renderTime: number;
  componentCount: number;
}

export const usePerformanceMonitor = () => {
  const { isDebugMode, log, warn } = useDebug();
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memoryUsage: 0,
    renderTime: 0,
    componentCount: 0,
  });

  // Мониторинг FPS
  useEffect(() => {
    if (!isDebugMode) return;

    let frameCount = 0;
    let lastTime = performance.now();
    let fps = 0;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime - lastTime >= 1000) {
        fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        frameCount = 0;
        lastTime = currentTime;

        setMetrics(prev => ({ ...prev, fps }));

        if (fps < 30) {
          warn(`Low FPS detected: ${fps}`, { fps, timestamp: new Date().toISOString() });
        }
      }

      requestAnimationFrame(measureFPS);
    };

    const animationId = requestAnimationFrame(measureFPS);

    return () => cancelAnimationFrame(animationId);
  }, [isDebugMode, warn]);

  // Мониторинг памяти
  useEffect(() => {
    if (!isDebugMode) return;

    const checkMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const memoryUsage = Math.round(memory.usedJSHeapSize / memory.jsHeapSizeLimit * 100);

        setMetrics(prev => ({ ...prev, memoryUsage }));

        if (memoryUsage > 80) {
          warn(`High memory usage: ${memoryUsage}%`, {
            used: memory.usedJSHeapSize,
            total: memory.totalJSHeapSize,
            limit: memory.jsHeapSizeLimit,
            percentage: memoryUsage
          });
        }
      }
    };

    const interval = setInterval(checkMemory, 5000); // Проверять каждые 5 секунд
    checkMemory(); // Первоначальная проверка

    return () => clearInterval(interval);
  }, [isDebugMode, warn]);

  // Мониторинг времени рендеринга
  const measureRenderTime = useCallback((componentName: string, renderStart: number) => {
    if (!isDebugMode) return;

    const renderTime = performance.now() - renderStart;
    setMetrics(prev => ({ ...prev, renderTime }));

    if (renderTime > 16) { // Более 16ms считается медленным рендером
      warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`, {
        component: componentName,
        renderTime,
        timestamp: new Date().toISOString()
      });
    }
  }, [isDebugMode, warn]);

  // Подсчет компонентов (React DevTools)
  useEffect(() => {
    if (!isDebugMode) return;

    const countComponents = () => {
      // В будущем можно интегрировать с React DevTools
      setMetrics(prev => ({ ...prev, componentCount: React.Children.count(null) }));
    };

    const interval = setInterval(countComponents, 10000); // Каждые 10 секунд
    return () => clearInterval(interval);
  }, [isDebugMode]);

  return {
    metrics,
    measureRenderTime,
    logPerformanceIssue: (issue: string, data?: any) => {
      log(`Performance issue: ${issue}`, data);
    }
  };
};
