class BufferTracking {
  private _timer = undefined;
  // private _scrubbing = undefined;
  private _bufferPosition = undefined;
  private _bufferStart = undefined;
  private _bufferEnd = undefined;
  private _bufferCount = undefined;
  private _readyState = undefined;
  private _videoPlayer = undefined;

  constructor(videoPlayer) {
    this._videoPlayer = videoPlayer;
  }

  reset() {
    console.log('Buffer.ts, reset() called');
    if (this._timer) {
      clearTimeout(this._timer);
    }
    // this._scrubbing = undefined;
    this._bufferPosition = undefined;
    this._bufferStart = undefined;
    this._bufferEnd = undefined;
    this._bufferCount = undefined;
    this._readyState = undefined;
  }

  onPause() {
    console.log('Buffer.ts, onPause() called');
    this._bufferStart = false;

    /* if (this.scrubbing() && !(config.bufferingConfig && config.bufferingConfig.includeScrub)) {
      this._scrubbing = true;
      this._timer = setTimeout(() => {
        this._scrubbing = false;
      }, 200);
    } */
  }

  onPlayerWaiting() {
    console.log('Buffer.ts, onPlayerWaiting() called');
    // TODO: current time -> pass video player
    if (this._bufferStart === false && this._videoPlayer.currentTime > 0) {
      this._bufferStart = new Date();
      this._bufferPosition = +this._videoPlayer.currentTime.toFixed(0);
      this._readyState = +this._videoPlayer.readyState;
    }
  }

  onTimeupdate() {
    console.log('bufferStart', this._bufferStart);
    console.log('Buffer.ts, onTimeupdate() called');
    const curTime = +this._videoPlayer.currentTime.toFixed(0);

    if (this._bufferStart && curTime !== this._bufferPosition) {
      this._bufferEnd = new Date();

      const secondsToLoad = ((this._bufferEnd - this._bufferStart) / 1000);

      this._bufferStart = false;
      this._bufferPosition = false;
      this._bufferCount++;

      // tracking:buffered
      return {
        currentTime: +curTime,
        readyState: +this._readyState,
        secondsToLoad: +secondsToLoad.toFixed(3),
        bufferCount: +this._bufferCount,
      };
    }
  }
}

export default BufferTracking;
