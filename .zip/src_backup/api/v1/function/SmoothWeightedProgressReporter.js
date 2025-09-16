/**
 * SmoothWeightedProgressReporter
 * Класс для отслеживания прогресса выполнения с плавным обновлением
 */

export class SmoothWeightedProgressReporter {
  constructor() {
    this.steps = new Map();
    this.totalWeight = 0;
    this.completedWeight = 0;
    this.onProgress = null;
  }

  /**
   * Добавляет шаг с указанным весом
   * @param {string} key - Уникальный ключ шага
   * @param {number} weight - Вес шага (влияет на общий прогресс)
   * @param {string} [description] - Описание шага
   */
  addStep(key, weight, description = '') {
    if (this.steps.has(key)) {
      throw new Error(`Шаг с ключом '${key}' уже существует`);
    }
    
    this.steps.set(key, {
      weight,
      description,
      completed: false,
      progress: 0
    });
    
    this.totalWeight += weight;
  }

  /**
   * Начинает выполнение шага
   * @param {string} key - Ключ шага
   * @param {string} [status] - Текущий статус выполнения
   */
  start(key, status = '') {
    const step = this.steps.get(key);
    if (!step) {
      throw new Error(`Шаг с ключом '${key}' не найден`);
    }
    
    step.status = status;
    step.startedAt = Date.now();
    this._notify();
  }

  /**
   * Обновляет прогресс выполнения шага
   * @param {string} key - Ключ шага
   * @param {number} progress - Прогресс от 0 до 1
   * @param {string} [status] - Текущий статус выполнения
   */
  update(key, progress, status) {
    const step = this.steps.get(key);
    if (!step) {
      throw new Error(`Шаг с ключом '${key}' не найден`);
    }
    
    // Вычитаем предыдущий прогресс из общего прогресса
    this.completedWeight -= step.weight * step.progress;
    
    // Обновляем прогресс шага
    step.progress = Math.max(0, Math.min(1, progress));
    if (status !== undefined) {
      step.status = status;
    }
    
    // Добавляем обновленный прогресс в общий прогресс
    this.completedWeight += step.weight * step.progress;
    
    this._notify();
  }

  /**
   * Завершает выполнение шага
   * @param {string} key - Ключ шага
   * @param {string} [status] - Финальный статус выполнения
   */
  finish(key, status) {
    const step = this.steps.get(key);
    if (!step) {
      throw new Error(`Шаг с ключом '${key}' не найден`);
    }
    
    // Вычитаем предыдущий прогресс из общего прогресса
    this.completedWeight -= step.weight * step.progress;
    
    // Устанавливаем прогресс в 100%
    step.progress = 1;
    step.completed = true;
    step.completedAt = Date.now();
    
    if (status !== undefined) {
      step.status = status;
    }
    
    // Добавляем обновленный прогресс в общий прогресс
    this.completedWeight += step.weight;
    
    this._notify();
  }

  /**
   * Возвращает общий прогресс выполнения
   * @returns {number} Прогресс от 0 до 1
   */
  getProgress() {
    return this.totalWeight > 0 ? this.completedWeight / this.totalWeight : 0;
  }

  /**
   * Возвращает текущий статус выполнения
   * @returns {Object} Статус выполнения
   */
  getStatus() {
    const now = Date.now();
    const activeSteps = [];
    let completedSteps = 0;
    
    // Собираем информацию о шагах
    for (const [key, step] of this.steps.entries()) {
      if (step.completed) {
        completedSteps++;
      } else if (step.startedAt) {
        activeSteps.push({
          key,
          ...step,
          elapsed: now - step.startedAt
        });
      }
    }
    
    // Сортируем активные шаги по времени начала (новые вверху)
    activeSteps.sort((a, b) => b.startedAt - a.startedAt);
    
    return {
      progress: this.getProgress(),
      completedSteps,
      totalSteps: this.steps.size,
      activeSteps,
      allSteps: Object.fromEntries(this.steps)
    };
  }

  /**
   * Устанавливает обработчик обновления прогресса
   * @param {Function} callback - Функция обратного вызова
   */
  onProgressUpdate(callback) {
    this.onProgress = callback;
  }

  /**
   * Отправляет уведомление об изменении прогресса
   * @private
   */
  _notify() {
    if (typeof this.onProgress === 'function') {
      try {
        this.onProgress(this.getStatus());
      } catch (e) {
        console.error('Ошибка в обработчике onProgress:', e);
      }
    }
  }
}

// Экспортируем синглтон для удобства
export const progressReporter = new SmoothWeightedProgressReporter();

export default progressReporter;
