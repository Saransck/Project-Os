/**
 * Step-by-Step Simulation Controller
 * Manages simulation playback, speed, step forward/backward, time scrubbing, and state events.
 */

export class SimulationEngine {
  constructor() {
    this.currentStepIndex = 0;
    this.isPlaying = false;
    this.timer = null;
    this.speed = 1.0; // 1x = 750ms per step
    this.result = null;
    this.onUpdateCallbacks = [];
    this.onCompleteCallbacks = [];
  }

  loadResult(result) {
    this.pause();
    this.result = result;
    this.currentStepIndex = 0;
    this.notifyUpdate();
  }

  onUpdate(fn) {
    this.onUpdateCallbacks.push(fn);
  }

  onComplete(fn) {
    this.onCompleteCallbacks.push(fn);
  }

  notifyUpdate() {
    if (!this.result || !this.result.steps) return;
    const currentStep = this.result.steps[this.currentStepIndex] || null;
    const progress = this.result.steps.length > 1 
      ? (this.currentStepIndex / (this.result.steps.length - 1)) * 100 
      : 100;

    const state = {
      stepIndex: this.currentStepIndex,
      totalSteps: this.result.steps.length,
      currentStep,
      progress,
      isPlaying: this.isPlaying,
      result: this.result,
      isFinished: this.currentStepIndex >= this.result.steps.length - 1,
    };

    this.onUpdateCallbacks.forEach((cb) => cb(state));
  }

  play() {
    if (this.isPlaying) return;
    if (!this.result || !this.result.steps || this.result.steps.length === 0) return;

    if (this.currentStepIndex >= this.result.steps.length - 1) {
      this.currentStepIndex = 0;
    }

    this.isPlaying = true;
    this.notifyUpdate();
    this.scheduleNextTick();
  }

  pause() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.notifyUpdate();
  }

  setSpeed(speedVal) {
    this.speed = Math.max(0.2, Math.min(10, Number(speedVal) || 1.0));
    if (this.isPlaying) {
      if (this.timer) clearTimeout(this.timer);
      this.scheduleNextTick();
    }
  }

  scheduleNextTick() {
    if (!this.isPlaying) return;
    const interval = Math.max(80, Math.floor(750 / this.speed));
    this.timer = setTimeout(() => {
      this.tick();
    }, interval);
  }

  tick() {
    if (!this.isPlaying) return;
    if (this.currentStepIndex < this.result.steps.length - 1) {
      this.currentStepIndex++;
      this.notifyUpdate();
      this.scheduleNextTick();
    } else {
      this.pause();
      this.onCompleteCallbacks.forEach((cb) => cb());
    }
  }

  stepForward() {
    this.pause();
    if (this.result && this.result.steps && this.currentStepIndex < this.result.steps.length - 1) {
      this.currentStepIndex++;
      this.notifyUpdate();
    }
  }

  stepBackward() {
    this.pause();
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.notifyUpdate();
    }
  }

  jumpToStep(index) {
    this.pause();
    if (!this.result || !this.result.steps) return;
    this.currentStepIndex = Math.max(0, Math.min(this.result.steps.length - 1, index));
    this.notifyUpdate();
  }

  jumpToTime(targetTime) {
    this.pause();
    if (!this.result || !this.result.steps || this.result.steps.length === 0) return;
    const target = Number(targetTime);
    let bestIdx = 0;
    let minDiff = Infinity;
    this.result.steps.forEach((s, idx) => {
      const diff = Math.abs(s.time - target);
      if (diff < minDiff) {
        minDiff = diff;
        bestIdx = idx;
      }
    });
    this.currentStepIndex = bestIdx;
    this.notifyUpdate();
  }

  jumpToEnd() {
    this.pause();
    if (!this.result || !this.result.steps) return;
    this.currentStepIndex = this.result.steps.length - 1;
    this.notifyUpdate();
  }

  reset() {
    this.pause();
    this.currentStepIndex = 0;
    this.notifyUpdate();
  }
}
