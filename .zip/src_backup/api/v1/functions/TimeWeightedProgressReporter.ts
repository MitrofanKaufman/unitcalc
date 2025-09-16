// path: src/api/v1/functions/TimeWeightedProgressReporter.js
import fs from 'fs';
import path from 'path';

const STATS_PATH = path.resolve('steps.json');

export default class TimeWeightedProgressReporter {
  constructor(sendFn, options = {}) {
    this.send = sendFn;
    this.stats = {};
    this.liveTimings = {};
    this.start = Date.now();
    this.isCalibration = false;

    this.latency = options.latency || 100;
    this.downloadSpeed = options.downloadSpeed || 10;

    if (fs.existsSync(STATS_PATH)) {
      try {
        const fileData = JSON.parse(fs.readFileSync(STATS_PATH, 'utf-8'));
        this.stats = fileData.steps || {};
        this.referenceLatency = fileData.latency || this.latency;
        this.referenceSpeed = fileData.downloadSpeed || this.downloadSpeed;
      } catch {
        this.stats = {};
        this.referenceLatency = this.latency;
        this.referenceSpeed = this.downloadSpeed;
      }
    } else {
      this.isCalibration = true;
      this.referenceLatency = this.latency;
      this.referenceSpeed = this.downloadSpeed;
    }
  }

  _calculateWeight(duration) {
    const latencyFactor = this.latency / this.referenceLatency;
    const speedFactor = this.referenceSpeed / this.downloadSpeed;
    return duration * latencyFactor * speedFactor;
  }

  _reportInternal(name, percent, text) {
    const now = Date.now();
    if (!this.liveTimings[name]) {
      this.liveTimings[name] = { start: now, duration: 0 };
    }
    const elapsed = now - this.liveTimings[name].start;
    this.liveTimings[name].duration = elapsed;

    const allNames = new Set([
      ...Object.keys(this.stats),
      ...Object.keys(this.liveTimings),
    ]);

    let totalWeight = 0;
    let currentProgress = 0;

    for (const n of allNames) {
      const base = this.stats[n] || this.liveTimings[n]?.duration || 0;
      totalWeight += this._calculateWeight(base);
    }

    for (const [n, timing] of Object.entries(this.liveTimings)) {
      const base = this.stats[n] || timing.duration || 0;
      const weight = this._calculateWeight(base);
      const done = n === name ? percent / 100 : 1;
      currentProgress += weight * done;
    }

    const finalPercent = totalWeight > 0
      ? Math.min(100, Math.round(currentProgress / totalWeight * 100))
      : 0;

    this.send(finalPercent, text);
  }

  step(name) {
    return ({ percent, text }) => this._reportInternal(name, percent, text);
  }

  substep(name) {
    return this.step(name); // alias
  }

  async saveStatsIfNeeded() {
    if (this.isCalibration) {
      const result = {};
      for (const [name, data] of Object.entries(this.liveTimings)) {
        result[name] = data.duration;
      }
      const payload = {
        steps: result,
        latency: this.latency,
        downloadSpeed: this.downloadSpeed
      };
      fs.writeFileSync(STATS_PATH, JSON.stringify(payload, null, 2));
    }
  }
}