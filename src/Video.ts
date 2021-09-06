import Amplify from '@aws-amplify/core';
import VideoBase from './VideoBase';
import {
  MetadataDict, Mutation, Query, PlayerbackConfig, StorageConfig,
} from './Interfaces';
import { Mutations, Queries } from './graphql';
import VideoAnalytics from './Analytics';
import PlayTracking from './Tracking/Play';

export default class VideoClass extends VideoBase {
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
    super();
    this._config = {};
    this._storage = new StorageClass();
    this._auth = Auth;
    this._api = API;
    this._analytics = Analytics;
    this._extensions = ['mpg', 'mp4', 'm2ts', 'mov'];
    this._mutations = {};
    this._queries = {};
    console.log('Updated');
  }

  public configure(config?: any) {
    super.configure(config);
    this._config = config;
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

    this._mutations = Object.entries(Mutations).reduce((acc, [mutationKey, mutationFunc]) => {
      acc[mutationKey] = mutationFunc(this._config.signedUrl);
      return acc;
    }, {});
    this._queries = Object.entries(Queries).reduce((acc, [queryKey, queryFunc]) => {
      acc[queryKey] = queryFunc(this._config.signedUrl);
      return acc;
    }, {});

    return this._config;
  }

  public static getModuleName() {
    return 'Video';
  }

  public async upload(file, metadatadict: MetadataDict, config: StorageConfig) {
    const { uuid } = this;
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
      ...config,
    };

    try {
      const videoObjectResponse: any = await this._api.graphql(
        graphqlOperation(this._mutations.createVideoObject, videoObject),
      );
      const vodAssetResponse: any = await this._api.graphql(
        graphqlOperation(this._mutations.createVodAsset, videoAsset),
      );
      const storageResponse: any = await this._storage.put(`${uuid}.${fileExtension[fileExtension.length - 1]}`, file, config);
      return {
        data: {
          createVideoObject,
          createVodAsset,
          key,
        },
      };
    } catch (error) {
      return this.logger.error(error);
    }
  }

  public async delete(vodAssetVideoId: string, config: StorageConfig) {
    const input = {
      input: {
        id: vodAssetVideoId,
      },
    };
    config = {
      ...config,
    };

    try {
      const videoObjectResponse: any = await this._api.graphql(
        graphqlOperation(this._mutations.deleteVideoObject, input),
      );
      const vodAssetResponse: any = await this._api.graphql(
        graphqlOperation(this._mutations.deleteVodAsset, input),
      );
      const { deleteVideoObject } = responses[0].data;
      const { deleteVodAsset } = responses[1].data;
      return {
        data: {
          deleteVideoObject,
          deleteVodAsset,
        },
      };
    } catch (error) {
      return this.logger.error(error);
    }
  }

  public async metadata(vodAssetVideoId: string, metadatadict?: MetadataDict) {
    try {
      if (metadatadict === undefined || metadatadict === null) {
        const vodAssetResponse: any = await this._api.graphql(
          graphqlOperation(this._queries.getVodAsset, {
            id: vodAssetVideoId,
          }),
        );
        return vodAssetResponse;
      }
      const vodAssetResponse: any = await this._api.graphql(
        graphqlOperation(this._mutations.updateVodAsset, {
          input: { id: vodAssetVideoId, ...metadatadict },
        }),
      );
      return vodAssetResponse;
    } catch (error) {
      return this.logger.error(error);
    }
  }

  public async playback(vodAssetVideoId: string, config?: PlayerbackConfig) {
    const vodAssetResponse: any = await this._api.graphql(
      graphqlOperation(this._queries.getVodAsset, {
        id: vodAssetVideoId,
      }),
    );
    console.log(vodAssetResponse.data);
    const { id } = vodAssetResponse.data.getVodAsset;
    if (!this._config.signedUrl) {
      const { token } = vodAssetResponse.data.getVodAsset.video;
      return {
        data: {
          playbackUrl: `${config.awsOutputVideo}/${id}/${id}.m3u8`,
        },
      };
    } catch (error) {
      return this.logger.error(error);
    }
  }

  public async record(streamName: string, provider: string, instance: any) {
    this.analytics.config = {
      streamName,
      provider,
    };
    this.analytics.videoPlayer = instance;
    instance.player.on('play', () =>
      this.analytics.play(this.analytics.getPlaylistType(instance.player)),
    );
    instance.player.on('loadstart', () => {
      this.analytics.loadedStarted();
    });
    instance.player.on('loadeddata', () => {
      this.analytics.loadedData({
        duration: instance.player.duration(),
        packageType: this.analytics.getPackageType(instance.player),
        playbackAttr: instance.player.tech().vhs.playlists.media_.attributes,
      });
      console.log('currentVideo', this.analytics.currentVideo);
    });
    instance.player.on('waiting', () => {
      this.analytics.buffering(instance.player.currentTime());
    });
    instance.player.on('canplaythrough', () => {
      this.analytics.bufferCompleted();
    });
    instance.player.on('timeupdate', () => {
      const intPlayedTime = parseInt(instance.player.currentTime(), 10);
      const everyFiveSec = intPlayedTime % 5 === 0 && intPlayedTime !== 0;
      // process it only every 5 seconds.
      if (everyFiveSec) {
        this.analytics.timeUpdate({
          duration: instance.player.duration(),
          time: instance.player.currentTime(),
        });
      }
    });
    instance.player.on('seeking', () => this.analytics.seeking());
    instance.player.on('seeked', () => {
      this.analytics.seeked({
        currentTime: instance.player.currentTime(),
      });
    });
    instance.player.on('mediachange', () => {
      this.analytics.step({
        playbackAttr:
          instance.player.tech(true).vhs.playlists.media_.attributes,
        packageType: this.analytics.getPackageType(instance.player),
        time: instance.player.currentTime(),
      });
    });
    instance.player.on('error', (err) => {
      this.analytics.errorOccured({
        time: instance.player.currentTime(),
        error: err,
      });
    });
    instance.player.on('pause', () => this.analytics.pause());
    instance.player.on('ended', () => {
      this.analytics.ended({
        currentTime: instance.player.currentTime(),
        duration: instance.player.duration(),
      });
    });
  }
}
