/**
 * Утилита для отложенного выполнения функций
 */

export class Debouncer {
  private timer: number | undefined;

  /**
   * Выполняет функцию с задержкой, отменяя предыдущий запрос
   * @param fn Функция для выполнения
   * @param delay Задержка в миллисекундах (по умолчанию 300мс)
   */
  debounce(fn: () => void, delay = 300) {
    if (this.timer) clearTimeout(this.timer);
    this.timer = window.setTimeout(fn, delay);
  }
}
