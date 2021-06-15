import Amplify, { ConsoleLogger as Logger } from '@aws-amplify/core';
import { Analytics, AWSKinesisProvider } from '@aws-amplify/analytics';

class BaseAnalytics {
  private _instance: typeof Analytics = undefined;
  private _config: any = undefined;
  private _logger: Logger = undefined;
  private _videoPlayer: HTMLMediaElement = undefined;

  constructor(config: any) {
    this._instance = Analytics;
    this._config = config;
    this._logger = new Logger('Analytics');
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

  get logger() {
    return this._logger;
  }

  get videoPlayer() {
    return this._videoPlayer;
  }

  set videoPlayer(videoPlayer: HTMLMediaElement) {
    this._videoPlayer = videoPlayer;
  }

  public configure(config: any) {
    this._config = config;
    this._instance.configure({
      AWSKinesis: { region: this._config.aws_project_region },
      AWSKinesisFirehose: { region: this._config.aws_project_region },
    });
    Amplify.register(this._instance);
    this._instance.addPluggable(new AWSKinesisProvider());
  }

  public record(data) {
    this.instance.record(
      {
        data,
        streamName: this.config.streamName,
      },
      this.config.provider,
    );
  }
}

export default BaseAnalytics;
