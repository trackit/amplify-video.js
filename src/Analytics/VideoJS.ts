import BaseAnalytics from './BaseAnalytics';

class VideoJS extends BaseAnalytics {
  play(playlistType?: string): void {
    this.log(`In play with playlistType ${playlistType}`);
    this.log(`Video Start at ${new Date().toLocaleTimeString()}`);

    // set whether the video being played is VOD or Live
    this.commonAttr.playlist_type = playlistType;

    const metricValue = this.buildMetric(this.MetricType.PLAY, [
      this.currentVideo.currentTime,
      this.currentVideo.duration,
    ]);
    this.record(metricValue);
  }

  loadedStarted(): void {
    this.currentVideo.loadStarted = Date.now();
  }

  private timeToFirstFrame({ playbackAttr, time }) {
    this.log(`Time to First Frame ${time}  ms`);

    this.connectionType = this.getConnectionType();
    const metricValue = this.buildMetric(this.MetricType.FIRSTFRAME, [
      this.connectionType.type,
      this.currentVideo.packageType,
      this.currentVideo.resolution,
      playbackAttr['FRAME-RATE'],
      playbackAttr['AVERAGE-BANDWIDTH'],
      time,
    ]);
    return metricValue;
  }

  loadedData({ packageType, playbackAttr, duration }): void {
    this.currentVideo.packageType = packageType.toUpperCase();
    if (playbackAttr['AVERAGE-BANDWIDTH']) {
      this.currentVideo.avgBitrate = parseInt(
        playbackAttr['AVERAGE-BANDWIDTH'],
        10,
      );
    } else {
      this.currentVideo.avgBitrate = 0;
    }
    console.log('duration', duration);
    this.currentVideo.duration = duration;
    this.currentVideo.resolution = this.parseResolution(playbackAttr);
    this.currentVideo.frameRate = playbackAttr['FRAME-RATE'];

    const dataloadedTime = Date.now();

    if (!this.currentVideo.dataLoaded) {
      this.timeToFirstFrame({
        playbackAttr,
        time: dataloadedTime - this.currentVideo.loadStarted,
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

  bufferCompleted() {
    const time = this.currentVideo.currentTime;
    if (this.currentVideo.isBuffering) {
      const bufferingTime = Date.now() - this.currentVideo.bufferStarted;
      this.updateBufferStatus('ScreenFreezedBuffer', bufferingTime, time);
    } else {
      this.firstBufferCompleted();
    }
    if (this.currentVideo.seekStart) {
      this.seeked({ currentTime: this.currentVideo.previousTime });
    }
    this.currentVideo.isBuffering = false;
    return this.currentVideo.isBuffering;
  }

  step({ playbackAttr, packageType }) {
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
    this.record(metricValue);
  }

  timeUpdate({ time }): void {
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
      );
    }
  }

  seeking(): void {
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
    const metricValue = this.buildMetric(this.MetricType.SEEK, [
      this.currentVideo.seekStart,
      currentTime,
      this.connectionType.type,
      timeTakenToSeek,
    ]);
    this.record(metricValue);
  }

  pause(): void {
    // to avoid firing pause metric which is also called when video playback is //finished
    if (this.currentVideo.currentTime === this.currentVideo.duration) return;

    this.log(`Video Paused at ${this.currentVideo.currentTime}`);
    const metricValue = this.buildMetric(this.MetricType.PAUSE, [
      this.currentVideo.currentTime,
      this.currentVideo.duration,
    ]);
    this.record(metricValue);
  }

  ended({ currentTime, duration }): void {
    if (currentTime === duration) {
      this.stop(currentTime);
    } else {
      this.errorOccured({
        time: currentTime,
        error: null,
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

    this.record(metricValue);
  }

  errorOccured({ time, error }) {
    const text = 'Some thing went wrong at ';
    this.error = error || text + new Date().toUTCString();

    const metricValue = this.buildMetric(this.MetricType.ERROR, [
      time,
      'Error',
    ]);
    this.record(metricValue);
  }

  private captureStreamingLogs(
    stream_package,
    resolution,
    fps,
    bitrate,
    duration,
  ) {
    this.connectionType = this.getConnectionType();
    const metricValue = this.buildMetric(this.MetricType.STREAM, [
      this.currentVideo.currentTime,
      this.connectionType.type,
      stream_package,
      resolution,
      fps,
      bitrate,
      duration,
    ]);
    this.log(`Streaming at ${this.currentVideo.currentTime}`);
    this.record(metricValue);
  }

  private updateBufferStatus(bufferType, timeTakenToBuffer, time) {
    this.connectionType = this.getConnectionType();
    const metricValue = this.buildMetric(this.MetricType.BUFFER, [
      bufferType,
      time,
      this.connectionType.type,
      timeTakenToBuffer,
    ]);
    this.log(`${bufferType} ready in ${timeTakenToBuffer} ms`);
    this.record(metricValue);
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

export default VideoJS;
