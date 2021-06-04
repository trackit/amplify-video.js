export default class PlayTracking {
  /* Tracks first play event and how long it takes to load the video */
  private firstplay: boolean;
  private loadstart: Date;
  private loadend: Date;
  private secondsToLoad: number;

  constructor() {
    this.firstplay = false;
    this.loadstart = null;
    this.loadend = null;
    this.secondsToLoad = 0;
  }

  private reset() {
    this.firstplay = false;
    this.loadstart = null;
    this.loadend = null;
    this.secondsToLoad = 0;
  }

  public onLoadStart() {
    this.reset();
    this.loadstart = new Date();
  }

  public onLoadedData() {
    this.loadend = new Date();
    this.secondsToLoad =
      (this.loadend.getTime() - this.loadstart.getTime()) / 1000;
  }

  public onPlaying() {
    if (!this.firstplay) {
      this.firstplay = true;
      // Send to kinesis (firstplay: secondsToLoad)
      // this.trigger('tracking:firstplay', {
      //   secondsToLoad: +(secondsToLoad.toFixed(3))
      // });
      console.log('First play secondsToLoad: ', +this.secondsToLoad.toFixed(3));
    }
  }
}
