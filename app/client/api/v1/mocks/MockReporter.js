/**
 * MockReporter - простой мок для тестирования
 * Имитирует базовую функциональность репортера для отладки
 */

export class MockReporter {
  constructor(onStatus = console.log) {
    this.onStatus = onStatus;
    this.steps = new Map();
  }

  start(step, message) {
    this.steps.set(step, { started: true, message });
    this.onStatus({ step, status: 'started', message });
  }

  finish(step, result) {
    this.steps.set(step, { ...this.steps.get(step), finished: true, result });
    this.onStatus({ step, status: 'finished', result });
  }

  error(step, error) {
    this.steps.set(step, { ...this.steps.get(step), error: true, message: error.message });
    this.onStatus({ step, status: 'error', error });
  }

  // Эмуляция методов WeightedProgressReporter
  setWeights(weights) {
    this.weights = weights;
  }

  // Дополнительные методы для совместимости
  setProgress(step, progress, message) {
    this.onStatus({ step, progress, message });
  }
}

export default MockReporter;
