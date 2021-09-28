import Amplify from '@aws-amplify/core';
import { Analytics, AWSKinesisProvider } from '@aws-amplify/analytics';
import MetricValues from './MetricValues';
import { MetricType } from '../Interfaces';
import VideoPlayer from './VideoPlayer';

abstract class BaseAnalytics extends VideoPlayer {
  private readonly _instance: typeof Analytics;

  private readonly _metricValues;
  private _commonAttr = {
    playlist_type: null,
  };
  private _error;
  private _config: any;

  protected MetricType: typeof MetricType;

  constructor(config: any) {
    super();
    this._instance = Analytics;
    this._config = config;
    this._commonAttr = {
      playlist_type: null,
    };
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

  get commonAttr() {
    return this._commonAttr;
  }

  set commonAttr(attr) {
    this._commonAttr = { ...this._commonAttr, ...attr };
  }

  get error() {
    return this._error;
  }

  set error(error) {
    this._error = error;
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

  protected buildMetric(
    metricName: string,
    args: Array<any>,
  ): Record<string, any> {
    const metricObj = this._metricValues[metricName];
    Object.keys(metricObj).forEach((key, index) => {
      metricObj[key] = args[index];
    });
    return {
      MetricType: metricName,
      ...metricObj,
      ...this.commonAttr,
      TimeStamp: Date.now(),
    };
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
