import PlayTracking from './Play';
import PauseTracking from './Pause';
import BufferTracking from './Buffer';
import BaseAnalytics from './BaseAnalytics';
import SeekTracking from './Seek';

class Analytics extends BaseAnalytics {
  private _playTracking = undefined;
  private _pauseTracking = undefined;
  private _bufferTracking = undefined;
  private _seekTracking = undefined;

  public playTracking() {
    this._playTracking = new PlayTracking();
    this.videoPlayer.addEventListener('dispose', this._playTracking.reset());
    this.videoPlayer.addEventListener('loadstart', this._playTracking.onLoadStart());
    this.videoPlayer.addEventListener('loadeddata', this._playTracking.onLoadedData());
    this.videoPlayer.addEventListener('playing', () => {
      const record = this._playTracking.onPlaying();
      if (record) {
        this.record({
          eventName: 'tracking:firstplay',
          value: record,
        });
        console.log('tracking:firstplay', record);
      }
    });
  }

  public pauseTracking() {
    this._pauseTracking = new PauseTracking();
    this.videoPlayer.addEventListener('dispose', this._pauseTracking.reset());
    this.videoPlayer.addEventListener('loadstart', this._pauseTracking.reset());
    this.videoPlayer.addEventListener('ended', this._pauseTracking.reset());
    this.videoPlayer.addEventListener('pause', () => {
      const record = this._pauseTracking.onPause();
      if (record) {
        this.record({
          eventName: 'tracking:pause',
          value: record,
        });
        console.log('tracking:pause', record);
      }
    });
  }

  public bufferTracking() {
    this._bufferTracking = new BufferTracking(this.videoPlayer);
    this.videoPlayer.addEventListener('dispose', this._bufferTracking.reset());
    this.videoPlayer.addEventListener('loadstart', this._bufferTracking.reset());
    this.videoPlayer.addEventListener('ended', this._bufferTracking.reset());
    this.videoPlayer.addEventListener('pause', this._bufferTracking.onPause());
    this.videoPlayer.addEventListener('waiting', this._bufferTracking.onPlayerWaiting());
    this.videoPlayer.addEventListener('timeupdate', () => {
      const record = this._bufferTracking.onTimeupdate();
      if (record) {
        this.record({
          eventName: 'tracking:buffered',
          value: record,
        });
      }
      console.log('record: ', record);
    });
  }

  public seekTracking() {
    this._seekTracking = new SeekTracking(this.videoPlayer);
    this.videoPlayer.addEventListener('dispose', this._seekTracking.reset());
    this.videoPlayer.addEventListener('loadstart', this._seekTracking.reset());
    this.videoPlayer.addEventListener('ended', this._seekTracking.reset());
    this.videoPlayer.addEventListener('play', this._seekTracking.onPlay());
    this.videoPlayer.addEventListener('pause', () => {
      const record = this._seekTracking.onPause();
      if (record) {
        this.record({
          eventName: 'tracking:seek',
          value: record,
        });
      }
      console.log('tracking:seek', record);
    });
  }
}

export default Analytics;
