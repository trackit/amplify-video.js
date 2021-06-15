import Amplify, { ConsoleLogger as Logger } from '@aws-amplify/core';
import { StorageClass } from '@aws-amplify/storage';

class BaseStorage {
  private _instance: StorageClass = undefined;
  private _config: any = undefined;
  private _bucketConfig = undefined;
  private _logger = undefined;
  private _extensions: Array<string> = undefined;

  constructor(config: any) {
    this._instance = new StorageClass();
    this._config = {
      contentType: 'video/*',
      region: config.aws_project_region,
      customPrefix: {
        public: '',
      },
      ...config,
    };
    this._logger = new Logger('BaseStorage');
    this._extensions = ['mpg', 'mp4', 'm2ts', 'mov'];
    this.configure();
  }

  get bucketConfig() {
    return this._bucketConfig;
  }

  set config(values) {
    this._config = { ...values, ...this._config };
  }

  get extensions() {
    return this._extensions;
  }

  get config() {
    return this._config;
  }

  get logger() {
    return this._logger;
  }

  get instance() {
    return this._instance;
  }

  public configure() {
    Amplify.register(this._instance);
  }
}

export default BaseStorage;
