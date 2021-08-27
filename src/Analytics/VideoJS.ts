import BaseAnalytics from './BaseAnalytics';

// TODO: Replace function parameters with object destructuration

class VideoJS extends BaseAnalytics {
  play(playlistType) {
    this.log(`In play with playlistType ${playlistType}`);
    this.log(`Video Start at ${new Date().toLocaleTimeString()}`);

    // set whether the video being played is VOD or Live
    this.commonAttr.playlist_type = playlistType;

    const metricValue = this.buildMetric(this.MetricType.PLAY, [
      this.currentVideo.currentTime,
      this.currentVideo.duration,
    ]);

     
    // return sendToAWS(calculatedMetric);
  }

  loadedStarted() {
    this.currentVideo.loadStarted = Date.now();
  }

  private timeToFirstFrame({ playbackAttr, time, cdn_request_id, rtt }) {
    this.log(`Time to First Frame ${time}  ms`);

    this.connectionType = this.getConnectionType();
    const metricValue = this.buildMetric(this.MetricType.FIRSTFRAME, [
      rtt,
      this.connectionType.type,
      this.currentVideo.packageType,
      this.currentVideo.resolution,
      playbackAttr['FRAME-RATE'],
      playbackAttr['AVERAGE-BANDWIDTH'],
      time,
      cdn_request_id,
    ]);
    // var calculatedMetric = Metric(metericName, metricValue);
    return metricValue;
  }

  loadeddata({ duration, packageType, playbackAttr, cdn_request_id, rtt }) {
    this.currentVideo.packageType = packageType.toUpperCase();
    if (playbackAttr['AVERAGE-BANDWIDTH']) {
      this.currentVideo.avgBitrate = parseInt(
        playbackAttr['AVERAGE-BANDWIDTH'],
        10,
      );
    } else {
      this.currentVideo.avgBitrate = 0;
    }
    this.currentVideo.duration = duration;
    this.currentVideo.resolution = this.parseResolution(playbackAttr);
    this.currentVideo.frameRate = playbackAttr['FRAME-RATE'];

    const dataloadedTime = Date.now();

    if (!this.currentVideo.dataLoaded) {
      this.timeToFirstFrame({
        playbackAttr,
        time: dataloadedTime - this.currentVideo.loadStarted,
        cdn_request_id,
        rtt,
      });
    }
    this.currentVideo.dataLoaded = dataloadedTime;
  }

  buffering(time) {
    if (time === 0) {
      this.log('Initial buffering..');
    } else {
      this.log(`Buffering at : ${time}`);
    }
    this.currentVideo.isBuffering = true;
    this.currentVideo.bufferStarted = Date.now();
  }

  bufferCompleted({ cdn_request_id, rtt }) {
    const time = this.currentVideo.currentTime;
    if (this.currentVideo.isBuffering) {
      const bufferingTime = Date.now() - this.currentVideo.bufferStarted;
      this.updateBufferStatus(
        'ScreenFreezedBuffer',
        bufferingTime,
        time,
        cdn_request_id,
        rtt,
      );
    } else {
      this.firstBufferCompleted(time, cdn_request_id, rtt);
    }
    if (this.currentVideo.seekStart) {
      this.seeked(this.currentVideo.previousTime);
    }
    this.currentVideo.isBuffering = false;
    return this.currentVideo.isBuffering;
  }

  step({ playbackAttr, packageType, time }) {
    let direction = null;
    let newAvgBitrate = 0;
    if (playbackAttr['AVERAGE-BANDWIDTH']) {
      newAvgBitrate = parseInt(playbackAttr['AVERAGE-BANDWIDTH'], 10);
    } else {
      newAvgBitrate = 0;
    }
    this.currentVideo.packageType = packageType.toUpperCase();
    // if current bitrate is 0, then its the step down operation
    // at the start of play
    if (this.currentVideo.avgBitrate === 0) {
      direction = 'DOWN';
    } else {
      direction = this.currentVideo.avgBitrate > newAvgBitrate ? 'DOWN' : 'UP';
    }
    this.connectionType = this.getConnectionType();
    const metricValue = this.buildMetric(this.MetricType.STEP, [
      this.currentVideo.currentTime,
      this.currentVideo.avgBitrate,
      newAvgBitrate,
      direction,
      this.currentVideo.packageType,
      this.currentVideo.resolution,
      this.currentVideo.frameRate,
      this.connectionType.type,
    ]);
    this.currentVideo.avgBitrate = newAvgBitrate;
    this.log(`Bitrate Step ${direction} at : ${this.currentVideo.currentTime}`);
    // return sendToAWS(calculatedMetric);
  }

  timeUpdate({ time, duration, cdn_request_id, rtt }) {
    const intPlayedTime = parseInt(time, 10);

    this.currentVideo.previousTime = this.currentVideo.currentTime;
    this.currentVideo.currentTime = time;

    if (this.currentVideo.percentSeen !== intPlayedTime) {
      this.currentVideo.percentSeen = intPlayedTime;
      this.captureStreamingLogs(
        this.currentVideo.packageType,
        this.currentVideo.resolution,
        this.currentVideo.frameRate,
        this.currentVideo.avgBitrate,
        this.currentVideo.duration,
        cdn_request_id,
        rtt,
      );
    }
  }

  seeking() {
    if (this.currentVideo.seekStart === null) {
      this.currentVideo.seekStart = this.currentVideo.previousTime;
      this.currentVideo.seekStartTime = Date.now();
    }
    this.currentVideo.isBuffering = true;
  }

  seeked({ currentTime, cdn_request_id, rtt }) {
    const timeTakenToSeek = Date.now() - this.currentVideo.seekStartTime;
    this.log(
      `Seeked from ${this.currentVideo.seekStart} to ${currentTime} in ${timeTakenToSeek} ms`,
    );
    this.updateSeekStatus(currentTime, timeTakenToSeek, cdn_request_id, rtt);
    this.currentVideo.seekStart = null;
    return this.currentVideo.seekStart;
  }

  updateSeekStatus({ currentTime, timeTakenToSeek, cdn_request_id, rtt }) {
    this.connectionType = this.getConnectionType();
    const metricValue = setMetricValue(this.MetricType.SEEK, [
      this.currentVideo.seekStart,
      currentTime,
      rtt,
      this.connectionType.type,
      timeTakenToSeek,
      cdn_request_id,
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
    let text = '';
    if (currentTime === duration) {
      text = 'Finished playing at';
      this.stop(currentTime);
    } else {
      text = 'Video Ended with some error at ';
      this.errorOccured({
        time: currentTime,
        cdn_request_id: text + new Date().toUTCString(),
      });
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
      this.currentVideo.resolution,
      this.currentVideo.frameRate,
      this.currentVideo.avgBitrate,
    ]);

    // return sendToAWS(calculatedMetric);
  }

  errorOccured({ time, cdn_request_id, error }) {
    const text = 'Some thing went wrong at ';
    // displayMetrics(text, new Date().toLocaleTimeString());
    this.error = error || text + new Date().toUTCString();

    const metricValue = this.buildMetric(this.MetricType.ERROR, [
      time,
      'Error',
      cdn_request_id,
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
    cdn_request_id,
    rtt,
  ) {
    this.connectionType = this.getConnectionType();
    const metricValue = this.buildMetric(this.MetricType.BUFFER, [
      bufferType,
      time,
      rtt,
      this.connectionType.type,
      timeTakenToBuffer,
      cdn_request_id,
    ]);
    // displayMetrics("Completed " + bufferType + " at :", new Date().toLocaleTimeString());
    this.log(`${bufferType} ready in ${timeTakenToBuffer} ms`);
    // return sendToAWS(metricValue);
  }

  private firstBufferCompleted(time, cdn_request_id, rtt) {
    const timeTakenToBuffer = Date.now() - this.currentVideo.loadStarted;
    return this.updateBufferStatus(
      'FirstBuffer',
      timeTakenToBuffer,
      this.currentVideo.currentTime,
      cdn_request_id,
      rtt,
    );
  }
}

export default VideoJS;
