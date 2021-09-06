import Amplify, { ConsoleLogger as Logger } from '@aws-amplify/core';
import { Analytics, AWSKinesisProvider } from '@aws-amplify/analytics';
import MetricValues from './MetricValues';
import {
  CurrentVideo,
  CustomNavigator,
  Ended,
  ErrorOccured,
  LoadedData,
  MetricType,
  Player,
  Seeked,
  Step,
  TimeUpdate,
  UpdateSeekStatus,
} from '../Interfaces';

abstract class BaseAnalytics {
  private readonly _instance: typeof Analytics;
  private readonly _logger: Logger;
  private readonly _navigator: CustomNavigator;
  private readonly _metricValues;
  private _currentVideo: CurrentVideo;
  private _connectionType;
  private _commonAttr;
  private _error;
  private _config: any;
  private _videoPlayer: HTMLMediaElement;
  protected MetricType: typeof MetricType;

  abstract play(playlistType?: string): void;
  abstract pause(): void;
  abstract ended(params: Ended): void;
  abstract stop(time?: number): void;
  abstract errorOccured(params: ErrorOccured): void;

  abstract loadedData(params: LoadedData): void;
  abstract loadedStarted(): void;

  abstract buffering(time?: number): void;
  abstract bufferCompleted(): void;

  abstract step(params: Step): void;
  abstract timeUpdate(params: TimeUpdate): void;

  abstract seeked(params: Seeked): void;
  abstract seeking(): void;
  abstract updateSeekStatus(params: UpdateSeekStatus): void;

  constructor(config: any) {
    this._instance = Analytics;
    this._config = config;
    this._logger = new Logger('Analytics');
    this._currentVideo = this.resetVideo('');
    this._commonAttr = {};
    this._navigator = navigator;
    this._metricValues = MetricValues;
    this._connectionType = this.getConnectionType();
    this.MetricType = MetricType;
    this.configure(config);
  }

  get config() {
    return this._config;
  }

  set config(values) {
    this._config = { ...values, ...this._config };
  }

  get instance() {
    return this._instance;
  }

  get videoPlayer() {
    return this._videoPlayer;
  }

  set videoPlayer(videoPlayer: HTMLMediaElement) {
    this._videoPlayer = videoPlayer;
  }

  get currentVideo() {
    return this._currentVideo;
  }

  set currentVideo(value) {
    this._currentVideo = { ...this._currentVideo, ...value };
  }

  get commonAttr() {
    return this._commonAttr;
  }

  set commonAttr(attr) {
    this._commonAttr = attr;
  }

  get error() {
    return this._error;
  }

  set error(error) {
    this._error = error;
  }

  set connectionType(value) {
    this._connectionType = value;
  }

  get connectionType() {
    return this._connectionType;
  }

  protected getCallerName(): string {
    try {
      throw new Error();
    } catch (e) {
      try {
        return e.stack.split('at ')[3].split(' ')[0];
      } catch (_) {
        return '';
      }
    }
  }

  protected log(data: string): void {
    console.log(this.getCallerName(), data);
  }

  protected getConnectionType(): Record<string, unknown> {
    const connection =
      this._navigator.connection ||
      this._navigator.mozConnection ||
      this._navigator.webkitConnection;
    return {
      type: connection
        ? connection.type || connection.effectiveType
        : 'not available',
      rtt: connection ? connection.rtt : -1,
    };
  }

  protected parseResolution(playbackAttr: Record<string, any>): string {
    return `${playbackAttr.RESOLUTION.width} x ${playbackAttr.RESOLUTION.height}`;
  }

  getSegmentInfo(player: Player): string {
    // If video.js
    const segmentDuration =
      player.tech(true).vhs.playlists.media_.targetDuration;
    const segmentIndex = Math.floor(player.currentTime() / segmentDuration);
    // console.log("In timeupdate.segmentCount ",segmentIndex);
    const segmentInfo =
      player.tech(true).vhs.playlists.media_.segments[segmentIndex];
    return segmentInfo;
  }

  getPackageType(player: Player): string {
    return player.tech(true).vhs.masterPlaylistController_.sourceType_;
  }

  getPlaylistType(player: Player): string {
    try {
      return player.tech(true).vhs.playlists.media_.playlistType;
    } catch (e) {
      return 'LIVE';
    }
  }

  private resetVideo(videoId: string): CurrentVideo {
    return {
      videoId,
      previousTime: 0,
      currentTime: 0,
      seekStart: null,
      seekStartTime: 0,
      seekEndTime: 0,
      loadStarted: 0,
      dataLoaded: null,
      percentSeen: 0,
      packageType: null,
      avgBitrate: 0,
      duration: 0,
      resolution: null,
      frameRate: 0,
      bufferStarted: 0,
      isBuffering: false,
    };
  }

  protected buildMetric(
    metricName: string,
    args: Array<any>,
  ): Record<string, any> {
    const metricObj = this._metricValues[metricName];
    Object.keys(metricObj).forEach((key, index) => {
      metricObj[key] = args[index];
    });
    return { MetricType: metricName, ...metricObj, TimeStamp: Date.now() };
  }

  private configure(config: any) {
    this._config = config;
    this._instance.configure({
      AWSKinesis: { region: this._config.aws_project_region },
      AWSKinesisFirehose: { region: this._config.aws_project_region },
    });
    Amplify.register(this._instance);
    this._instance.addPluggable(new AWSKinesisProvider());
  }

  protected record(metrics: any): void {
    this.log(metrics);
    this.instance.record(
      {
        data: `${JSON.stringify(metrics)}\n`,
        streamName: this.config.streamName,
      },
      this.config.provider,
    );
  }
}

export default BaseAnalytics;
