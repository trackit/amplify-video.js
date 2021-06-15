class PlayTracking {
  private _firstplay = false;
  private _loadstart = undefined;
  private _loadend = undefined;
  private _secondsToLoad = undefined;

  reset() {
    console.log('Play.ts, reset() called');
    this._firstplay = false;
    this._loadstart = 0;
    this._loadend = 0;
    this._secondsToLoad = 0;
  }

  onLoadStart() {
    console.log('Play.ts, onLoadStart() called');
    this.reset();
    this._loadstart = new Date();
  }

  onLoadedData() {
    console.log('Play.ts, onLoadedData() called');
    this._loadend = new Date();
    this._secondsToLoad = ((this._loadend - this._loadstart) / 1000);
  }

  onPlaying() {
    console.log('Play.ts, onPlaying() called');
    if (!this._firstplay) {
      this._firstplay = true;
      return {
        secondsToLoad: +(this._secondsToLoad.toFixed(3)),
      };
    }
  }
}

export default PlayTracking;
