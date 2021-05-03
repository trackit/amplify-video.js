import { v4 as uuidv4 } from 'uuid';
import { ConsoleLogger as Logger, Amplify } from '@aws-amplify/core';
import { StorageClass } from '@aws-amplify/storage';
import { API, graphqlOperation } from '@aws-amplify/api';
import AuthClass, { Auth } from '@aws-amplify/auth';
import Analytics from '@aws-amplify/analytics';
import {
  AbstractFactory, MetadataDict, PlayerbackConfig, StorageConfig,
} from './Interfaces';
import { TokenFactory, OwnerFactory } from './graphql/Factory';

const logger = new Logger('VideoClass');

export default class VideoClass {
  private _config: any;
  private _bucketConfig: {};
  private _auth: typeof AuthClass;
  private _api: typeof API;
  private _analytics: typeof Analytics;
  private _storage: StorageClass;
  private _extensions: Array<string>;
  private _factory: AbstractFactory;

  constructor() {
    this._config = {};
    this._storage = new StorageClass();
    this._auth = Auth;
    this._api = API;
    this._analytics = Analytics;
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
    Amplify.configure(config);
    Amplify.register(this._api);
    Amplify.register(this._auth);
    Amplify.register(this._storage);
    Amplify.register(this._analytics);

    if (this._config.signedUrl) {
      this._factory = new TokenFactory();
    } else {
      this._factory = new OwnerFactory();
    }
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
        graphqlOperation(this._factory.createMutation().createVideoObject(), videoObject),
      );
      const vodAssetResponse: any = await this._api.graphql(
        graphqlOperation(this._factory.createMutation().createVodAsset(), videoAsset),
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
        graphqlOperation(this._factory.createMutation().deleteVideoObject(), input),
      );
      const vodAssetResponse: any = await this._api.graphql(
        graphqlOperation(this._factory.createMutation().deleteVodAsset(), input),
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
          graphqlOperation(this._factory.createQuery().getVodAsset(), { id: vodAssetVideoId }),
        );
        return vodAssetResponse;
      }
      const vodAssetResponse: any = await this._api.graphql(
        graphqlOperation(this._factory.createMutation()
          .updateVodAsset(), { input: { id: vodAssetVideoId, ...metadatadict } }),
      );
      return vodAssetResponse;
    } catch (error) {
      return logger.error(error);
    }
  }

  public async playback(vodAssetVideoId: string, config?: PlayerbackConfig) {
    const vodAssetResponse: any = await this._api.graphql(
      graphqlOperation(this._factory.createQuery().getVodAsset(), { id: vodAssetVideoId }),
    );
    const { id } = vodAssetResponse.data.getVodAsset;
    if (this._config.signedUrl) {
      const { token } = vodAssetResponse.data.getVodAsset.video;
      return {
        data: {
          playbackUrl: `https://${config.awsOutputVideo}/${id}/${id}.m3u8`,
          token,
        },
      };
    }
    return {
      data: {
        playbackUrl: `${config.awsOutputVideo}/${id}/${id}.m3u8`,
      },
    };
  }

  public async analytics(event: string | { [key: string]: string }) {
    const data = await this._analytics.record(event);
    return data;
  }
}
