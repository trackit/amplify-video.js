import BaseAnalytics from './BaseAnalytics';

// TODO: Replace function parameters with object destructuration

class Vanilla extends BaseAnalytics {
  play(playlistType) {
    console.log('In play with playlistType ', playlistType);
    displayMetrics('Video Start at ', new Date().toLocaleTimeString());
    const metericName = 'PLAY';
    // set whether the video being played is VOD or Live
    this.commonAttr.playlist_type = playlistType;
    const metricValue = setMetricValue(metericName, [
      this.currentVideo.currentTime, this.currentVideo.duration,
    ]);
    const calculatedMetric = Metric(metericName, metricValue);
    return sendToAWS(calculatedMetric);
  }

  loadedStarted() {
    this.currentVideo.loadStarted = Date.now();
  }

  private timeToFirstFrame({ time }) {
    displayMetrics('Time to First Frame ', `${time} ms`);

    const metericName = 'FIRSTFRAME';
    this.connectionType = this.getConnectionType();
    const metricValue = setMetricValue(metericName, [time]);
    const calculatedMetric = Metric(metericName, metricValue);
    return sendToAWS(calculatedMetric);
  }

  loadeddata() {
    const dataloadedTime = Date.now();

    if (!this.currentVideo.dataLoaded) {
      this.timeToFirstFrame({ time: dataloadedTime - this.currentVideo.loadStarted });
    }
    this.currentVideo.dataLoaded = dataloadedTime;
  }

  buffering(time) {
    if (time === 0) {
      displayMetrics('Initial buffering..', '');
    } else {
      displayMetrics('Buffering at :', time);
    }
    this.currentVideo.isBuffering = true;
    this.currentVideo.bufferStarted = Date.now();
  }

  bufferCompleted() {
    const time = this.currentVideo.currentTime;
    if (this.currentVideo.isBuffering) {
      const bufferingTime = Date.now() - this.currentVideo.bufferStarted;
      this.updateBufferStatus('ScreenFreezedBuffer', bufferingTime, time);
    } else {
      this.firstBufferCompleted(time);
    }
    if (this.currentVideo.seekStart) {
      this.seeked({ currentTime: this.currentVideo.previousTime });
    }
    this.currentVideo.isBuffering = false;
    return this.currentVideo.isBuffering;
  }

  step() {
    this.connectionType = this.getConnectionType();
    const metricValue = this.buildMetric(this.MetricType.STEP, [
      this.currentVideo.currentTime,
      this.currentVideo.packageType,
      this.currentVideo.resolution,
      this.currentVideo.frameRate,
      this.connectionType.type,
    ]);
    // return sendToAWS(calculatedMetric);
  }

  timeUpdate({ time }) {
    this.currentVideo.previousTime = this.currentVideo.currentTime;
    this.currentVideo.currentTime = time;

    const intPlayedTime = parseInt(time, 10);

    if (this.currentVideo.percentSeen !== intPlayedTime) {
      this.currentVideo.percentSeen = intPlayedTime;
      // captureStreamingLogs(currentVideo.packageType, currentVideo.resolution,
      // currentVideo.frameRate, currentVideo.avgBitrate, currentVideo.duration,
      // cdn_request_id,rtt);
    }
  }

  seeking() {
    if (this.currentVideo.seekStart === null) {
      this.currentVideo.seekStart = this.currentVideo.previousTime;
      this.currentVideo.seekStartTime = Date.now();
    }
    this.currentVideo.isBuffering = true;
  }

  seeked({ currentTime }) {
    const timeTakenToSeek = Date.now() - this.currentVideo.seekStartTime;
    this.log(
      `Seeked from ${this.currentVideo.seekStart} to ${currentTime} in ${timeTakenToSeek} ms`,
    );
    this.updateSeekStatus({ currentTime, timeTakenToSeek });
    this.currentVideo.seekStart = null;
    return this.currentVideo.seekStart;
  }

  updateSeekStatus({ currentTime, timeTakenToSeek }) {
    this.connectionType = this.getConnectionType();
    const metricValue = setMetricValue(this.MetricType.SEEK, [
      this.currentVideo.seekStart,
      currentTime,
      this.connectionType.type,
      timeTakenToSeek,
    ]);
    // return sendToAWS(calculatedMetric);
  }

  pause() {
    // to avoid firing pause metric which is also called when video playback is //finished
    if (this.currentVideo.currentTime === this.currentVideo.duration) return;

    this.log(`Video Paused at ${this.currentVideo.currentTime}`);
    const metricValue = this.buildMetric(this.MetricType.PAUSE, [
      this.currentVideo.currentTime,
      this.currentVideo.duration,
    ]);
    // return sendToAWS(calculatedMetric);
  }

  ended({ currentTime, duration }) {
    // const text = '';
    if (currentTime === duration) {
      // text = 'Finished playing at';
      this.stop(currentTime);
    } else {
      // text = 'Video Ended with some error at ';
      // this.errorOccured({
      //   time: currentTime,
      //   cdn_request_id: text + new Date().toUTCString(),
      // });
    }
  }

  stop(time) {
    this.log(`Video Stopped at ${time}`);
    this.connectionType = this.getConnectionType();
    const metricValue = this.buildMetric(this.MetricType.STOP, [
      time,
      this.currentVideo.duration,
      this.connectionType.type,
      this.currentVideo.packageType,
      // this.currentVideo.resolution,
      // this.currentVideo.frameRate,
      // this.currentVideo.avgBitrate,
    ]);

    // return sendToAWS(calculatedMetric);
  }

  errorOccured({ time, error }) {
    const text = 'Some thing went wrong at ';
    // displayMetrics(text, new Date().toLocaleTimeString());
    this.error = error || text + new Date().toUTCString();

    const metricValue = this.buildMetric(this.MetricType.ERROR, [
      time,
      'Error',
      // cdn_request_id,
    ]);
    // return sendToAWS(calculatedMetric);
  }

  private captureStreamingLogs(
    stream_package,
    resolution,
    fps,
    bitrate,
    duration,
    cdn_request_id,
    rtt,
  ) {
    this.connectionType = this.getConnectionType();
    const metricValue = this.buildMetric(this.MetricType.STREAM, [
      this.currentVideo.currentTime,
      rtt,
      this.connectionType.type,
      stream_package,
      resolution,
      fps,
      bitrate,
      duration,
      cdn_request_id,
    ]);
    this.log(`Streaming at ${this.currentVideo.currentTime}`);
    // return sendToAWS(calculatedMetric);
  }

  private updateBufferStatus(
    bufferType,
    timeTakenToBuffer,
    time,
  ) {
    this.connectionType = this.getConnectionType();
    const metricValue = this.buildMetric(this.MetricType.BUFFER, [
      bufferType,
      time,
      this.connectionType.type,
      timeTakenToBuffer,
    ]);
    // displayMetrics("Completed " + bufferType + " at :", new Date().toLocaleTimeString());
    this.log(`${bufferType} ready in ${timeTakenToBuffer} ms`);
    // return sendToAWS(metricValue);
  }

  private firstBufferCompleted() {
    const timeTakenToBuffer = Date.now() - this.currentVideo.loadStarted;
    return this.updateBufferStatus(
      'FirstBuffer',
      timeTakenToBuffer,
      this.currentVideo.currentTime,
    );
  }
}

export default Vanilla;
