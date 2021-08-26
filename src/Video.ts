import { v4 as uuidv4 } from 'uuid';
import Amplify, { ConsoleLogger as Logger } from '@aws-amplify/core';
import { StorageClass } from '@aws-amplify/storage';
import { API, graphqlOperation } from '@aws-amplify/api';
import { Auth } from '@aws-amplify/auth';
import { Analytics, AWSKinesisProvider } from '@aws-amplify/analytics';
import {
  MetadataDict, Mutation, Query, PlayerbackConfig, StorageConfig,
} from './Interfaces';
import { Mutations, Queries } from './graphql';
import VideoAnalytics from './Analytics';
import PlayTracking from './Tracking/Play';

const logger = new Logger('VideoClass');

export default class VideoClass {
  private _config: any;
  private _bucketConfig: {};
  private _auth: typeof Auth;
  private _api: typeof API;
  private _analytics: typeof Analytics;
  private _storage: StorageClass;
  private _extensions: Array<string>;
  private _mutations: Mutation;
  private _queries: Query;

  constructor() {
    this._config = {};
    this._storage = new StorageClass();
    this._auth = Auth;
    this._api = API;
    this._analytics = Analytics;
    this._extensions = ['mpg', 'mp4', 'm2ts', 'mov'];
    this._mutations = Mutations;
    this._queries = Queries;
    console.log('Updated');
  }

  public configure(config?: any) {
    logger.debug('configure Video');
    console.log('issou');
    this._config = config;
    this._bucketConfig = {
      region: this._config.aws_project_region,
      customPrefix: {
        public: '',
      },
    };
    Amplify.configure(config);
    this._analytics.configure({
      AWSKinesis: { region: this._config.aws_project_region },
      AWSKinesisFirehose: { region: this._config.aws_project_region },
    });
    Amplify.register(this._auth);
    Amplify.register(this._api);
    Amplify.register(this._storage);
    Amplify.register(this._analytics);
    this._analytics.addPluggable(new AWSKinesisProvider());
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
        graphqlOperation(this._mutations.createVideoObject(this._config.signedUrl), videoObject),
      );
      const vodAssetResponse: any = await this._api.graphql(
        graphqlOperation(this._mutations.createVodAsset(this._config.signedUrl), videoAsset),
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
        graphqlOperation(this._mutations.deleteVideoObject(this._config.signedUrl), input),
      );
      const vodAssetResponse: any = await this._api.graphql(
        graphqlOperation(this._mutations.deleteVodAsset(this._config.signedUrl), input),
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
          graphqlOperation(this._queries.getVodAsset(this._config.signedUrl), {
            id: vodAssetVideoId,
          }),
        );
        return vodAssetResponse;
      }
      const vodAssetResponse: any = await this._api.graphql(
        graphqlOperation(this._mutations.updateVodAsset(this._config.signedUrl), {
          input: { id: vodAssetVideoId, ...metadatadict },
        }),
      );
      return vodAssetResponse;
    } catch (error) {
      return logger.error(error);
    }
  }

  public async playback(vodAssetVideoId: string, config?: PlayerbackConfig) {
    const vodAssetResponse: any = await this._api.graphql(
      graphqlOperation(this._queries.getVodAsset(this._config.signedUrl), {
        id: vodAssetVideoId,
      }),
    );
    console.log(vodAssetResponse.data);
    const { id } = vodAssetResponse.data.getVodAsset;
    if (!this._config.signedUrl) {
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

  public async analytics(streamName: string, provider: string) {
    const videoPlayers = window.document.getElementsByTagName('video');
    /*
    this.on('dispose', reset);
    this.on('loadstart', reset);
    this.on('ended', reset);
    this.on('pause', onPause);
    this.on('waiting', onPlayerWaiting);
    this.on('timeupdate', onTimeupdate);
  */
    Array.from(videoPlayers).forEach((videoPlayer) => {
      console.log(videoPlayer);
      const videoPlayerAnalytics = new VideoAnalytics(videoPlayer, this._analytics);
      const playingTracker = new PlayTracking();

      videoPlayer.addEventListener('pause', () => videoPlayerAnalytics.onPause(streamName, provider));
      // videoPlayer.addEventListener('waiting', () => videoPlayerAnalytics.onPlayerWaiting());
      // videoPlayer.addEventListener('timeupdate', () => videoPlayerAnalytics.onTimeupdate());

      // Playing events
      videoPlayer.addEventListener('dispose', () => console.log('dispose'));
      videoPlayer.addEventListener('loadstart', () => playingTracker.onLoadStart());
      videoPlayer.addEventListener('loadeddata', () => playingTracker.onLoadedData());
      videoPlayer.addEventListener('playing', () => playingTracker.onPlaying());
    });
    // this._analytics.record(
    //   {
    //     data,
    //     streamName,
    //   },
    //   'AWSKinesisFirehose',
    // );
  }
}
