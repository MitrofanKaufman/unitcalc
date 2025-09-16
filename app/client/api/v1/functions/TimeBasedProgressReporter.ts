// path: src/api/v1/functions/TimeBasedProgressReporter.js
export default class TimeBasedProgressReporter {
  constructor(sendFn) {
    this.send = sendFn;
    this.steps = [];
    this.startTime = Date.now();
  }

  /**
   * Регистрирует шаг и возвращает функцию report
   * @param {string} name - Название шага (необязательно)
   * @returns {object} - Объект с report({ text }) функцией
   */
  registerStep(name = '') {
    const step = { name, start: Date.now(), duration: 0 };
    this.steps.push(step);

    const report = ({ text }) => {
      const now = Date.now();
      step.duration = now - step.start;

      const totalElapsed = now - this.startTime;
      const completed = this.steps.reduce((sum, s) => sum + s.duration, 0);
      const percent = Math.min(100, Math.round((completed / totalElapsed) * 100));

      this.send(percent, text);
    };

    return { report };
  }
}