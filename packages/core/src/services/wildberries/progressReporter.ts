// C:\Users\Mitrofan Kaufman\WebstormProjects\wb-calc\packages\core\src\services\wildberries\progressReporter.ts
/**
 * path/to/file.ts
 * Описание: Репортёр прогресса для отслеживания процесса сбора данных
 * Логика: Клиентская/Серверная (серверная логика сбора данных)
 * Зависимости: Базовые типы TypeScript
 * Примечания: Отслеживает прогресс выполнения шагов сбора данных
 */

import type { CollectionProgress, ExecutionStep } from './types';

export interface ProgressCallback {
  (progress: CollectionProgress): void;
}

export class SmoothWeightedProgressReporter {
  private steps: Map<string, ExecutionStep> = new Map();
  private currentStep: string = '';
  private callback?: ProgressCallback;
  private startTime: number = Date.now();
  private weights: Record<string, number> = {};
  private totalWeight: number = 0;

  constructor(callback?: ProgressCallback, weights?: Record<string, number>) {
    this.callback = callback;
    if (weights) {
      this.setWeights(weights);
    }
  }

  setWeights(weights: Record<string, number>): void {
    this.weights = { ...weights };
    this.totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
  }

  start(stepName: string, message: string): void {
    this.currentStep = stepName;

    const step: ExecutionStep = {
      name: stepName,
      completed: false,
      startTime: Date.now()
    };

    this.steps.set(stepName, step);
    this.reportProgress(message);
  }

  finish(stepName: string): void {
    const step = this.steps.get(stepName);
    if (step) {
      step.completed = true;
      step.endTime = Date.now();
      this.steps.set(stepName, step);
    }

    if (stepName === this.currentStep) {
      this.currentStep = '';
    }

    this.reportProgress('Шаг завершен');
  }

  error(stepName: string, error: string): void {
    const step = this.steps.get(stepName);
    if (step) {
      step.error = error;
      step.completed = false;
      this.steps.set(stepName, step);
    }

    this.reportProgress(`Ошибка: ${error}`);
  }

  private reportProgress(message: string): void {
    if (!this.callback) return;

    const completedSteps = Array.from(this.steps.values()).filter(step => step.completed);
    const totalCompletedWeight = completedSteps.reduce((sum, step) => {
      return sum + (this.weights[step.name] || 0);
    }, 0);

    const percentage = this.totalWeight > 0 ? (totalCompletedWeight / this.totalWeight) * 100 : 0;

    const errors = Array.from(this.steps.values())
      .filter(step => step.error)
      .map(step => step.error!);

    const progress: CollectionProgress = {
      currentStep: this.currentStep,
      totalSteps: this.steps.size,
      percentage: Math.round(percentage),
      message,
      errors,
      data: this.getPartialData()
    };

    this.callback(progress);
  }

  private getPartialData(): any {
    // Здесь можно собрать частичные данные из выполненных шагов
    const data: any = {};

    this.steps.forEach((step, stepName) => {
      if (step.completed && stepName.startsWith('data_')) {
        // Извлечь данные из названия шага или метаданных
        // Это упрощенная реализация
      }
    });

    return Object.keys(data).length > 0 ? data : undefined;
  }

  getElapsed(): number {
    return Date.now() - this.startTime;
  }

  getSteps(): ExecutionStep[] {
    return Array.from(this.steps.values());
  }

  isCompleted(): boolean {
    return Array.from(this.steps.values()).every(step => step.completed);
  }

  hasErrors(): boolean {
    return Array.from(this.steps.values()).some(step => step.error);
  }
}

export class ProgressReporter {
  private callback?: ProgressCallback;
  private currentStep: string = '';
  private steps: string[] = [];
  private currentIndex: number = 0;

  constructor(callback?: ProgressCallback) {
    this.callback = callback;
  }

  setSteps(steps: string[]): void {
    this.steps = steps;
  }

  start(stepName: string, message: string): void {
    this.currentStep = stepName;
    this.currentIndex = this.steps.indexOf(stepName);

    if (this.callback) {
      const progress: CollectionProgress = {
        currentStep: stepName,
        totalSteps: this.steps.length,
        percentage: this.steps.length > 0 ? Math.round((this.currentIndex / this.steps.length) * 100) : 0,
        message,
        errors: []
      };
      this.callback(progress);
    }
  }

  finish(stepName: string): void {
    if (this.currentStep === stepName && this.callback) {
      const nextIndex = Math.min(this.currentIndex + 1, this.steps.length - 1);
      const progress: CollectionProgress = {
        currentStep: this.steps[nextIndex] || '',
        totalSteps: this.steps.length,
        percentage: this.steps.length > 0 ? Math.round(((nextIndex + 1) / this.steps.length) * 100) : 100,
        message: 'Шаг завершен',
        errors: []
      };
      this.callback(progress);
    }
  }
}
