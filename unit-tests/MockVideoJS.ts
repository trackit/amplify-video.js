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
    return;
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
    return;
  }

  loadedData(params: LoadedData) {
    return;
  }
  loadedStarted() {
    return;
  }

  buffering(time?: number) {
    this.currentVideo.isBuffering = true;
    this.currentVideo.bufferStarted = Date.now();
  }
  bufferCompleted() {
    return;
  }

  step(params: Step) {
    return;
  }
  timeUpdate(params: TimeUpdate) {
    return;
  }

  seeked(params: Seeked) {
    return;
  }
  seeking() {
    return;
  }
  updateSeekStatus(params: UpdateSeekStatus) {
    return;
  }
}
