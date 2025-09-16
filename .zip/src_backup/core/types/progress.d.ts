/**
 * Типы для работы с прогрессом выполнения операций
 */

declare module '@core/types/progress' {
  /**
   * Интерфейс для отслеживания прогресса
   */
  export interface Progress {
    /** Текущий прогресс (от 0 до 1) */
    progress: number;
    
    /** Сообщение о текущем состоянии */
    message: string;
    
    /** Дополнительные данные о прогрессе */
    data?: Record<string, any>;
  }

  /**
   * Функция обратного вызова для обновления прогресса
   */
  export type ProgressCallback = (progress: Progress) => void;

  /**
   * Опции для создания индикатора прогресса
   */
  export interface ProgressOptions {
    /** Начальное значение прогресса (по умолчанию 0) */
    initialProgress?: number;
    
    /** Начальное сообщение (по умолчанию пустая строка) */
    initialMessage?: string;
    
    /** Функция обратного вызова для обновления прогресса */
    onProgress?: ProgressCallback;
  }

  /**
   * Класс для управления прогрессом выполнения операции
   */
  export class ProgressReporter {
    /** Текущий прогресс (от 0 до 1) */
    progress: number;
    
    /** Текущее сообщение */
    message: string;
    
    /** Дополнительные данные */
    data: Record<string, any>;
    
    /** Функция обратного вызова */
    private onProgress: ProgressCallback | undefined;
    
    /**
     * Создает новый инстанс ProgressReporter
     */
    constructor(options: ProgressOptions = {}) {
      this.progress = options.initialProgress || 0;
      this.message = options.initialMessage || '';
      this.data = {};
      this.onProgress = options.onProgress;
    }
    
    /**
     * Обновляет прогресс
     */
    update(progress: number, message?: string, data?: Record<string, any>): void {
      this.progress = Math.max(0, Math.min(1, progress));
      
      if (message !== undefined) {
        this.message = message;
      }
      
      if (data !== undefined) {
        this.data = { ...this.data, ...data };
      }
      
      this.notify();
    }
    
    /**
     * Устанавливает сообщение без изменения прогресса
     */
    setMessage(message: string): void {
      this.message = message;
      this.notify();
    }
    
    /**
     * Устанавливает дополнительные данные
     */
    setData(data: Record<string, any>): void {
      this.data = { ...this.data, ...data };
      this.notify();
    }
    
    /**
     * Вызывает функцию обратного вызова, если она установлена
     */
    private notify(): void {
      if (this.onProgress) {
        this.onProgress({
          progress: this.progress,
          message: this.message,
          data: this.data
        });
      }
    }
    
    /**
     * Создает дочерний репортер для вложенных операций
     */
    createSubReporter(start: number, end: number, message?: string): ProgressReporter {
      const range = end - start;
      
      return new ProgressReporter({
        onProgress: ({ progress, message: subMessage, data }) => {
          const overallProgress = start + progress * range;
          const fullMessage = message 
            ? `${message}: ${subMessage}` 
            : subMessage;
          
          this.update(overallProgress, fullMessage, data);
        }
      });
    }
  }
}
