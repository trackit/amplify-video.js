import {
  Ended,
  ErrorOccured,
  LoadedData,
  Seeked,
  Step,
  TimeUpdate,
  UpdateSeekStatus,
} from '../src/Interfaces';
import BaseAnalytics from '../src/Analytics/BaseAnalytics';

export default class MockVideoJS extends BaseAnalytics {
  play() {
    return this.buildMetric(this.MetricType.PLAY, [
      this.currentVideo.currentTime,
      this.currentVideo.duration,
    ]);
  }

  pause() {
    return this.buildMetric(this.MetricType.PAUSE, [
      this.currentVideo.currentTime,
      this.currentVideo.duration,
    ]);
  }
  ended(params: Ended) {
    return params;
  }
  stop(time: number) {
    return this.buildMetric(this.MetricType.STOP, [
      time,
      this.currentVideo.duration,
      this.connectionType.type,
      this.currentVideo.packageType,
      this.currentVideo.resolution,
      this.currentVideo.frameRate,
      this.currentVideo.avgBitrate,
    ]);
  }
  errorOccured(params: ErrorOccured) {
    return params;
  }

  loadedData(params: LoadedData) {
    return params;
  }
  loadedStarted() {
    return;
  }

  buffering(time?: number) {
    this.currentVideo.isBuffering = true;
    this.currentVideo.bufferStarted = Date.now();
    return time;
  }
  bufferCompleted() {
    return;
  }

  step(params: Step) {
    return params;
  }
  timeUpdate(params: TimeUpdate) {
    return params;
  }

  seeked(params: Seeked) {
    return params;
  }
  seeking() {
    return;
  }
  updateSeekStatus(params: UpdateSeekStatus) {
    return params;
  }
}
