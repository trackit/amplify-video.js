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
  resolution: null;
  frameRate: number;
  bufferStarted: number;
  isBuffering: boolean;
}

abstract class BaseAnalytics {
  private readonly _instance: typeof Analytics;
  private readonly _logger: Logger;
  private readonly _currentVideo: CurrentVideo;
  private readonly _metricValues;
  private _config: any;
  private _videoPlayer: HTMLMediaElement;
  protected MetricType: typeof MetricType;

  abstract play();
  abstract pause();
  abstract ended();
  abstract stop();
  abstract errorOccured();
  abstract parseResolution();

  abstract loadedData();
  abstract loadedStarted();
  abstract timeToFirstFrame();

  abstract buffering();
  abstract bufferCompleted();

  abstract step();
  abstract timeUpdate();
  abstract captureStreamingLogs();

  abstract seeked();
  abstract seeking();
  abstract updateSeekStatus(currentTime, timeTakenToSeek);

  constructor(config: any) {
    this._instance = Analytics;
    this._config = config;
    this._logger = new Logger('Analytics');
    this._currentVideo = this.resetVideo('');
    this._metricValues = MetricValues;
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

  set videoPlayer(videoPlayer: HTMLMediaElement) {
    this._videoPlayer = videoPlayer;
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

  // TODO: Move to Analytics class
  protected updateBufferStatus(
    bufferType,
    timeTakenToBuffer,
    time,
    // cdn_request_id,
    // rtt,
  ) {
    const metricValue = this.buildMetric(this.MetricType.BUFFER, [
      bufferType,
      time,
      // rtt,
      // connectionType.type,
      timeTakenToBuffer,
      // cdn_request_id,
    ]);
    this.log(metricValue);
    this.log(`Completed ${bufferType} at : ${new Date().toLocaleTimeString()}`);
    this.log(`${bufferType} ready in : ${timeTakenToBuffer} ms`);
    // return sendToAWS(metricValue);
  }

  protected firstBufferCompleted() {
    const timeTakenToBuffer = Date.now() - this.currentVideo.loadStarted;
    return this.updateBufferStatus(
      'FirstBuffer',
      timeTakenToBuffer,
      this.currentVideo.currentTime,
    );
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
