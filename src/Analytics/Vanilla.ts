import BaseAnalytics from './BaseAnalytics';

class Vanilla extends BaseAnalytics {
  private loadStarted() {
    this.currentVideo.loadStarted = Date.now();
  }

  public play() {
    const metricValue = this.buildMetric(this.MetricType.PLAY, [
      this.currentVideo.currentTime,
      this.currentVideo.duration,
    ]);
    this.log(metricValue);
    // Send to AWS
    return null;
  }

  public pause() {
    // to avoid firing pause metric which is also called when video playback is finished
    if (this.videoPlayer.currentTime === this.videoPlayer.duration) return;
    const metricValue = this.buildMetric(this.MetricType.PAUSE, [
      this.currentVideo.currentTime,
      this.currentVideo.duration,
    ]);
    this.log(metricValue);
    // Send to AWS
    return null;
  }

  public loadedData() {
    /* if(playbackAttr["AVERAGE-BANDWIDTH"]){
        currentVideo.avgBitrate = parseInt(playbackAttr["AVERAGE-BANDWIDTH"]);
      }
      else{
        currentVideo.avgBitrate = 0;
      } */
    this.currentVideo.duration = this.videoPlayer.duration;
    this.currentVideo.resolution = undefined; // parseResolution(playbackAttr);
    this.currentVideo.frameRate = undefined; // playbackAttr["FRAME-RATE"];

    const dataloadedTime = Date.now();

    /* if (!currentVideo.dataLoaded) {
      timeToFirstFrame(
        playbackAttr,
        dataloadedTime - currentVideo.loadStarted,
        cdn_request_id,
        rtt,
      );
    } */
    this.currentVideo.dataLoaded = dataloadedTime;
    this.log('loadedData');
  }

  public buffering() {
    if (this.videoPlayer.currentTime === 0) {
      this.log('Initial buffering..');
    } else {
      this.log(`Buffering at : ${this.videoPlayer.currentTime}`);
    }
    this.currentVideo.isBuffering = true;
    this.currentVideo.bufferStarted = Date.now();
  }

  public bufferCompleted() {
    const time = this.currentVideo.currentTime;
    if (this.currentVideo.isBuffering) {
      const bufferingTime = Date.now() - this.currentVideo.bufferStarted;
      this.updateBufferStatus('ScreenFreezedBuffer', bufferingTime, time);
    } else {
      this.firstBufferCompleted();
    }
    if (this.currentVideo.seekStart) {
      // this.seeked(this.currentVideo.previousTime).bind(this);
    }
    this.currentVideo.isBuffering = false;
  }

  public step() {
    const metricValue = this.buildMetric(this.MetricType.STEP, [
      this.currentVideo.currentTime,
    ]);
    // Send metricValue
  }

  /* public timeUpdate(time, duration, cdn_request_id, rtt) {
    this.currentVideo.previousTime = this.currentVideo.currentTime;
    this.currentVideo.currentTime = time;

    const intPlayedTime = parseInt(time, 10);

    if (this.currentVideo.percentSeen !== intPlayedTime) {
      this.currentVideo.percentSeen = intPlayedTime;
      captureStreamingLogs(
        currentVideo.packageType,
        currentVideo.resolution,
        currentVideo.frameRate,
        currentVideo.avgBitrate,
        currentVideo.duration,
        cdn_request_id,
        rtt,
      );
    }
  } */

  public seeking() {
    if (this.currentVideo.seekStart === null) {
      this.currentVideo.seekStart = this.currentVideo.previousTime;
      this.currentVideo.seekStartTime = Date.now();
    }
    this.currentVideo.isBuffering = true;
  }

  public seeked() {
    const timeTakenToSeek = Date.now() - this.currentVideo.seekStartTime;
    // eslint-disable-next-line max-len
    // displayMetrics('Seeked from ', this.currentVideo.seekStart + ' to ' + currentTime + ' in ' + timeTakenToSeek + ' ms');
    this.updateSeekStatus(this.videoPlayer.currentTime, timeTakenToSeek);
    this.currentVideo.seekStart = null;
  }

  public updateSeekStatus(currentTime, timeTakenToSeek) {
    const metricValue = this.buildMetric(this.MetricType.SEEK, [
      this.currentVideo.seekStart,
      currentTime,
      timeTakenToSeek,
    ]);
    return metricValue;
    // return sendToAWS(metricValue);
  }
}

export default Vanilla;
