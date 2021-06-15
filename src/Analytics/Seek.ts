class SeekTracking {
  private _seekCount = 0;
  private _locked = true;
  private _videoPlayer = undefined;

  constructor(videoPlayer) {
    this._videoPlayer = videoPlayer;
  }

  reset() {
    console.log('Seek.ts, reset() called');
    this._seekCount = 0;
    this._locked = true;
  }

  onPlay() {
    console.log('Seek.ts, onPlay() called');
    this._locked = false;
  }

  onPause() {
    console.log('Seek.ts, onPause() called');
    if (this._locked) {
      return;
    }
    const curTime = +this._videoPlayer.currentTime.toFixed(0);

    this._seekCount++;
    return {
      seekCount: +this._seekCount,
      seekTo: curTime,
    };
  }
}

export default SeekTracking;
