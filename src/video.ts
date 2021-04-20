import { ConsoleLogger as Logger, Amplify } from '@aws-amplify/core';
import { StorageClass } from '@aws-amplify/storage';
import AuthClass, { Auth } from '@aws-amplify/auth';
import { StorageConfig } from './config.interface';

const logger = new Logger('VideoClass');

export default class VideoClass {
  private storage: StorageClass = new StorageClass();

  private auth: typeof AuthClass = Auth;

  private config: any;

  constructor() {
    this.config = {};
  }

  public configure(config?: any) {
    logger.debug('configure Video');
    this.config = config;
    Amplify.configure(config);
    Amplify.register(this.storage);
    Amplify.register(this.auth);
    return this.config;
  }

  public static getModuleName() {
    return 'Video';
  }

  public async upload(file, config: StorageConfig) {
    config = {
      region: this.config.aws_project_region,
      customPrefix: {
        public: '',
      },
      ...config,
    };
    // -> TODO: GraphQL
    return this.storage.put(file.name, file, config);
  }

  public async delete(asset: string, config: StorageConfig) {
    config = {
      region: this.config.aws_project_region,
      customPrefix: {
        public: '',
      },
      ...config,
    };

    // TODO: GraphQL
    return this.storage.remove(asset, config);
  }
}
