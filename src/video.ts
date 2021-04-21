import { ConsoleLogger as Logger, Amplify } from '@aws-amplify/core';
import { StorageClass } from '@aws-amplify/storage';
import { API, graphqlOperation } from '@aws-amplify/api';
import AuthClass, { Auth } from '@aws-amplify/auth';
import { v4 as uuidv4 } from 'uuid';

import { StorageConfig } from './config.interface';
import { createVideoObject, createVodAsset } from './graphql/mutation';

const logger = new Logger('VideoClass');

export default class VideoClass {
  private storage: StorageClass;

  private auth: typeof AuthClass;

  private api: typeof API;

  private config: any;

  constructor() {
    this.config = {};
    this.storage = new StorageClass();
    this.auth = Auth;
    this.api = API;
  }

  public configure(config?: any) {
    logger.debug('configure Video');
    this.config = config;
    Amplify.configure(config);
    Amplify.register(this.api);
    Amplify.register(this.auth);
    Amplify.register(this.storage);
    return this.config;
  }

  public static getModuleName() {
    return 'Video';
  }

  public async upload(file, metadatadict: any, config: StorageConfig) {
    if (file.type.split('/')[0] !== 'video') {
      return logger.error('Format is not supported (supported formats: .mpg, .mp4, .m2ts, .mov).');
    }
    const uuid = uuidv4();
    const fileExtension = file.name.toLowerCase().split('.');
    const videoObject = {
      input: {
        id: uuid,
      },
    };
    const videoAsset = {
      input: {
        vodAssetVideoId: uuid,
        ...metadatadict,
      },
    };
    config = {
      region: this.config.aws_project_region,
      customPrefix: {
        public: '',
      },
      contentType: 'video/*',
      ...config,
    };

    try {
      const videoObjectResponse: any = await this.api.graphql(
        graphqlOperation(createVideoObject, videoObject),
      );
      const vodAssetResponse: any = await this.api.graphql(
        graphqlOperation(createVodAsset, videoAsset),
      );
      const storageResponse: any = await this.storage.put(`${uuid}.${fileExtension[fileExtension.length - 1]}`, file, config);
      return {
        createVideoObject: videoObjectResponse.data.createVideoObject,
        createVodAsset: vodAssetResponse.data.createVodAsset,
        key: storageResponse.key,
      };
    } catch (error) {
      return logger.error(error);
    }
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
