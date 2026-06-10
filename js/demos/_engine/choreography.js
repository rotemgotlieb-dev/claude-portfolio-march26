/* Demo engine — choreography runner.
   Takes a timeline of { at: ms, do: () => {...} } entries plus a total
   duration. Schedules each step via setTimeout. Supports pause / resume
   from the paused offset and reset.

   Pause / resume semantics:
     - pause() clears all pending timeouts and stores the elapsed offset
       (now - playStartedAt). The current visual state is whatever the
       last completed step left.
     - resume() re-schedules each remaining step at (originalAt - offset),
       so the timeline continues exactly where it left off.
     - reset() pauses, calls the supplied onReset() to restore initial
       state, and zeroes the offset.

   Looping:
     - The timeline is single-pass; looping is the caller's responsibility
       via setTimeout(play, totalMs) inside the per-demo script. This
       keeps the engine class single-purpose.

   API:
     const choreo = new Choreography({ timeline, duration, onReset });
     choreo.play();
     choreo.pause();
     choreo.resume();
     choreo.reset();
*/
export class Choreography {
  constructor({ timeline, duration, onReset }) {
    this.timeline = timeline || [];
    this.duration = duration || 0;
    this.onReset = onReset || (() => {});
    this._pendingTimeouts = [];
    this._playStartedAt = 0;
    this._pausedOffset = 0;
    this._state = 'idle'; // idle | playing | paused
    this._stepCursor = 0;
  }

  play() {
    if (this._state === 'playing') return;
    if (this._state === 'idle') {
      this._stepCursor = 0;
      this._pausedOffset = 0;
    }
    this._playStartedAt = performance.now() - this._pausedOffset;
    this._state = 'playing';
    this._scheduleRemaining();
  }

  _scheduleRemaining() {
    const offset = this._pausedOffset;
    for (let i = this._stepCursor; i < this.timeline.length; i++) {
      const step = this.timeline[i];
      const delay = step.at - offset;
      if (delay < 0) continue;
      const stepIndex = i;
      const timeoutId = setTimeout(() => {
        try { step.do(); } catch (e) { /* swallow per loop iteration */ }
        this._stepCursor = stepIndex + 1;
      }, delay);
      this._pendingTimeouts.push(timeoutId);
    }
  }

  pause() {
    if (this._state !== 'playing') return;
    this._pausedOffset = performance.now() - this._playStartedAt;
    this._clearPending();
    this._state = 'paused';
  }

  resume() {
    if (this._state !== 'paused') return;
    this.play();
  }

  reset() {
    this._clearPending();
    this._pausedOffset = 0;
    this._stepCursor = 0;
    this._state = 'idle';
    try { this.onReset(); } catch (e) { /* swallow */ }
  }

  _clearPending() {
    this._pendingTimeouts.forEach(id => clearTimeout(id));
    this._pendingTimeouts = [];
  }

  get state() { return this._state; }

  /* Elapsed time since the most recent play() — used by per-demo loops
     that need to schedule the next loop iteration's setTimeout aware of
     paused time. In playing state: now - _playStartedAt. In paused
     state: the offset captured at pause. In idle: 0. */
  get elapsedMs() {
    if (this._state === 'playing') return performance.now() - this._playStartedAt;
    if (this._state === 'paused') return this._pausedOffset;
    return 0;
  }
}
