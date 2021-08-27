import Amplify, { ConsoleLogger as Logger } from '@aws-amplify/core';
import { Analytics, AWSKinesisProvider } from '@aws-amplify/analytics';
import MetricValues from './MetricValues';

enum MetricType {
  PLAY = 'PLAY',
  FIRSTFRAME = 'FIRSTFRAME',
  SEEK = 'SEEK',
  BUFFER = 'BUFFER',
  STREAM = 'STREAM',
  STEP = 'STEP',
  PAUSE = 'PAUSE',
  ERROR = 'ERROR',
  STOP = 'STOP',
}

interface CurrentVideo {
  videoId: string;
  previousTime: number;
  currentTime: number;
  seekStart: null | number;
  seekStartTime: number;
  seekEndTime: number;
  loadStarted: number;
  dataLoaded: null | number;
  percentSeen: number;
  packageType: null;
  avgBitrate: number;
  duration: number;
  resolution: null | string;
  frameRate: number;
  bufferStarted: number;
  isBuffering: boolean;
}

interface CustomNavigator extends Navigator {
  mozConnection?: any;
  webkitConnection?: any;
}

interface TimeToFirstFrame {
  playbackAttr: any;
  time: number;
  cdn_request_id: string;
  rtt: number;
}

interface LoadedData {
  duration: number;
  packageType: string;
  playbackAttr: any;
  cdn_request_id: string;
  rtt: string;
}

interface BufferCompleted {
  cdn_request_id: string;
  rtt: string;
}

interface Step {
  playbackAttr: any;
  packageType: string;
  time: number;
}

interface TimeUpdate {
  time: number;
  duration: number;
  cdn_request_id: string;
  rtt: string;
}

interface Seeked {
  currentTime: number;
  cdn_request_id: string;
  rtt: string;
}

interface UpdateSeekStatus {
  currentTime: number;
  timeTakenToSeek: number;
  cdn_request_id: string;
  rtt: string;
}

interface Ended {
  currentTime: number;
  duration: number;
}

interface ErrorOccured {
  time: number;
  cdn_request_id: string;
  error?: string;
}

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

  abstract play(playlistType?: string);
  abstract pause();
  abstract ended(params: Ended);
  abstract stop(time?: number);
  abstract errorOccured(params: ErrorOccured);

  abstract loadeddata(params: LoadedData);
  abstract loadedStarted();
  // TODO: define variables

  abstract buffering(time?: number);
  abstract bufferCompleted(params: BufferCompleted);

  abstract step(params: Step);
  abstract timeUpdate(params: TimeUpdate);

  abstract seeked(params: Seeked);
  abstract seeking();
  abstract updateSeekStatus(params: UpdateSeekStatus);

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

  get currentVideo() {
    return this._currentVideo;
  }

  get commonAttr() {
    return this._commonAttr;
  }

  get error() {
    return this._error;
  }

  set error(error) {
    this._error = error;
  }

  set commonAttr(attr) {
    this._commonAttr = attr;
  }

  set videoPlayer(videoPlayer: HTMLMediaElement) {
    this._videoPlayer = videoPlayer;
  }

  set connectionType(value) {
    this._connectionType = value;
  }

  get connectionType() {
    return this._connectionType;
  }

  protected getCallerName() {
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

  protected log(data) {
    console.log(this.getCallerName(), data);
  }

  protected getConnectionType() {
    // eslint-disable-next-line max-len
    // eslint-disable-next-line operator-linebreak
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

  protected parseResolution(playbackAttr) {
    return `${playbackAttr.RESOLUTION.width} x ${playbackAttr.RESOLUTION.height}`;
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

  protected buildMetric(metricName: string, args: Array<any>) {
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

  protected record(data) {
    this.instance.record(
      {
        data: {
          date: new Date(),
          ...data,
        },
        streamName: this.config.streamName,
      },
      this.config.provider,
    );
  }
}

export default BaseAnalytics;
