import { ConsoleLogger as Logger, Amplify } from '@aws-amplify/core';
import { StorageClass } from '@aws-amplify/storage';
import { API, graphqlOperation } from '@aws-amplify/api';
import AuthClass, { Auth } from '@aws-amplify/auth';
import Analytics from '@aws-amplify/analytics';
import { v4 as uuidv4 } from 'uuid';
import { MetadataDict, StorageConfig } from './video.interface';
import { getVodAsset } from './graphql/queries';
import MutationCreator from './Mutationfactory';

const logger = new Logger('VideoClass');

export default class VideoClass {
  private _storage: StorageClass;

  private _auth: typeof AuthClass;

  private _api: typeof API;

  private _analytics: typeof Analytics;

  private _config: any;

  private _bucketConfig: {};

  private _extensions: Array<string>;

  private _mutations: MutationCreator;

  constructor() {
    this._config = {};
    this._storage = new StorageClass();
    this._auth = Auth;
    this._api = API;
    // this._analytics = Analytics;-
    this._extensions = ['mpg', 'mp4', 'm2ts', 'mov'];
  }

  public configure(config?: any) {
    logger.debug('configure Video');
    this._config = config;
    this._bucketConfig = {
      region: this._config.aws_project_region,
      customPrefix: {
        public: '',
      },
    };
    console.log(Amplify.configure(config));
    Amplify.register(this._api);
    Amplify.register(this._auth);
    Amplify.register(this._storage);
    // Amplify.register(this._analytics);

    // if config.signedUrl = true
    this._mutations = new TokenMutationCreator();
    // else
    // this._mutations = new OwnerMutationCreator();
    return this._config;
  }

  public static getModuleName() {
    return 'Video';
  }

  public async upload(file, metadatadict: MetadataDict, config: StorageConfig) {
    if (file.type.split('/')[0] !== 'video') {
      return logger.error(`Format is not supported (supported formats:${this._extensions.map((extention) => ` .${extention}`)})`);
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
        id: uuid,
        vodAssetVideoId: uuid,
        ...metadatadict,
      },
    };
    config = {
      contentType: 'video/*',
      ...this._bucketConfig,
      ...config,
    };

    try {
      const videoObjectResponse: any = await this._api.graphql(
        graphqlOperation(this._mutations.factoryMethod().createVideoObject(), videoObject),
      );
      const vodAssetResponse: any = await this._api.graphql(
        graphqlOperation(this._mutations.factoryMethod().createVodAsset(), videoAsset),
      );
      const storageResponse: any = await this._storage.put(`${uuid}.${fileExtension[fileExtension.length - 1]}`, file, config);
      return {
        data: {
          createVideoObject: videoObjectResponse.data.createVideoObject,
          createVodAsset: vodAssetResponse.data.createVodAsset,
          key: storageResponse.key,
        },
      };
    } catch (error) {
      return logger.error(error);
    }
  }

  public async delete(vodAssetVideoId: string, config: StorageConfig) {
    const input = {
      input: {
        id: vodAssetVideoId,
      },
    };

    config = {
      ...this._bucketConfig,
      ...config,
    };

    try {
      const videoObjectResponse: any = await this._api.graphql(
        graphqlOperation(this._mutations.factoryMethod().deleteVideoObject(), input),
      );
      const vodAssetResponse: any = await this._api.graphql(
        graphqlOperation(this._mutations.factoryMethod().deleteVodAsset(), input),
      );
      await Promise.all(this._extensions.map((extension) => this._storage.remove(`${vodAssetVideoId}.${extension}`, config)));
      return {
        data: {
          deleteVideoObject: videoObjectResponse.data.deleteVideoObject,
          deleteVodAsset: vodAssetResponse.data.deleteVodAsset,
        },
      };
    } catch (error) {
      return logger.error(error);
    }
  }

  public async metadata(vodAssetVideoId: string, metadatadict?: MetadataDict) {
    try {
      if (metadatadict === undefined || metadatadict === null) {
        const vodAssetResponse: any = await this._api.graphql(
          graphqlOperation(getVodAsset, { id: vodAssetVideoId }),
        );
        return vodAssetResponse;
      }
      const vodAssetResponse: any = await this._api.graphql(
        graphqlOperation(this._mutations.factoryMethod().updateVodAsset(), { input: { id: vodAssetVideoId, ...metadatadict } }),
      );
      return vodAssetResponse;
    } catch (error) {
      return logger.error(error);
    }
  }

  public async analytics(event: string | { [key: string]: string }) {
    const data = await this._analytics.record(event);
    return data;
  }
}
