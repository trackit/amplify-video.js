interface Props {
  ready: boolean;
  value: Date;
}

export default class VideoAnalytics {
  private timer;
  private pauseCount = 0;
  private bufferPosition: boolean | number = false;
  private bufferStart: Props = { ready: false, value: null };
  private bufferEnd: Props = { ready: false, value: null };
  private bufferCount = 0;
  private videoPlayer: HTMLMediaElement;
  private _analytics;

  constructor(videoPlayer: HTMLVideoElement, analytics) {
    this.videoPlayer = videoPlayer;
    this._analytics = analytics;
  }

  public reset() {
    this.bufferPosition = false;
    this.bufferStart.ready = false;
    this.bufferEnd.ready = false;
    this.bufferCount = 0;
  }

  public onPlayerWaiting = () => {
    console.log(
      `onPlayerWaiting called \nbufferStart: ${this.bufferStart.ready}\ncurrentTime: ${this.videoPlayer.currentTime}`,
    );
    if (!this.bufferStart.ready) {
      this.bufferStart.value = new Date();
      this.bufferPosition = +this.videoPlayer.currentTime.toFixed(0);
      console.log('bufferStart value: ', this.bufferStart);
      console.log('bufferPosition value: ', this.bufferPosition);
      console.log('currentTime value: ', this.videoPlayer.currentTime);
    }
  };

  public onTimeupdate() {
    console.log('onTimeUpdate called');
    const curTime = +this.videoPlayer.currentTime.toFixed(0);
    console.log(`curTime: ${curTime} bufferPosition: ${this.bufferPosition}`);

    if (this.bufferStart.ready && curTime !== this.bufferPosition) {
      this.bufferEnd.value = new Date();

      const secondsToLoad =
        (this.bufferEnd.value.getTime() - this.bufferStart.value.getTime()) /
        1000;

      this.bufferStart.ready = false;
      this.bufferPosition = false;
      this.bufferCount++;

      // Send data to kinesis here
      const data = {
        currentTime: +curTime,
        secondsToLoad: +secondsToLoad.toFixed(3),
        bufferCount: +this.bufferCount,
      };
      console.log('data: ', data);
    }
  }

  public resetPauseCount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.pauseCount = 0;
  }

  public onPause(streamName: string, provider: string) {
    this.timer = setTimeout(() => {
      this.pauseCount++;
      console.log('pause count: ', this.pauseCount);
      this._analytics.record(
        {
          data: {
            eventName: 'pauseCount',
            value: this.pauseCount,
          },
          streamName,
        },
        provider,
      );
    }, 300);
  }
}
