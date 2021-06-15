class PauseTracking {
  private _pauseCount = 0;

  reset() {
    console.log('Pause.ts, reset() called');
    this._pauseCount = 0;
  }

  onPause() {
    this._pauseCount++;
    return {
      pauseCount: this._pauseCount,
    };
  }
}

export default PauseTracking;
