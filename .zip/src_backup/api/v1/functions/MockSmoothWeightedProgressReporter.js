// path: src/api/v1/functions/MockSmoothWeightedProgressReporter.js
/**
 * Упрощенная заглушка для SmoothWeightedProgressReporter
 * Используется для тестирования и обхода проблем с зависимостями
 */

export class SmoothWeightedProgressReporter {
  constructor(consumer = console.log, options = {}) {
    this.consumer = consumer;
    this._tick = options.tick || 400;
    this._stepMs = options.stepMs || 8000;
    this._reserve = options.reserve || 0.1;
    this._progress = 0;
    this._currentStep = null;
    this._timer = null;
  }

  start(step, message) {
    this._currentStep = step;
    this._progress = 0;
    this._updateProgress(0, message || `Starting ${step}...`);
    
    // Запускаем "сердцебиение"
    if (this._timer) clearInterval(this._timer);
    this._timer = setInterval(() => {
      if (this._progress < 0.9) { // Не доходим до 100% до вызова finish
        this._progress = Math.min(0.9, this._progress + 0.05);
        this._updateProgress(this._progress, `Processing ${this._currentStep}...`);
      }
    }, this._tick);
  }

  finish(step, result) {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
    this._updateProgress(1, `Completed ${step}`);
    if (typeof this.consumer === 'function') {
      this.consumer({ step, status: 'completed', result });
    }
  }

  error(step, error) {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
    console.error(`Error in ${step}:`, error);
    if (typeof this.consumer === 'function') {
      this.consumer({ step, status: 'error', error: error.message });
    }
  }

  _updateProgress(progress, message) {
    this._progress = progress;
    if (typeof this.consumer === 'function') {
      this.consumer({
        percent: Math.floor(progress * 100),
        text: message,
        step: this._currentStep,
        status: 'progress'
      });
    }
  }

  // Методы для совместимости с WeightedProgressReporter
  setWeights() {}
  validateWeights() {}
  setProgress() {}
}

export default SmoothWeightedProgressReporter;
