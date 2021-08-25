import Amplify from '@aws-amplify/core';
import VideoBase from './VideoBase';
import {
  AbstractFactory,
  MetadataDict,
  PlayerbackConfig,
  StorageConfig,
} from './Interfaces';
import { TokenFactory, OwnerFactory } from './graphql/Factory';

export default class VideoClass extends VideoBase {
  private _config: any;
  private _factory: AbstractFactory;

  constructor() {
    super();
    this._config = {};
  }

  public configure(config?: any) {
    super.configure(config);
    this._config = config;
    Amplify.configure(config);
    if (this._config.signedUrl) {
      this._factory = new OwnerFactory();
    } else {
      this._factory = new TokenFactory();
    }
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
      const params = {
        filename: `${uuid}.${fileExtension[fileExtension.length - 1]}`,
        file,
        config,
      };
      const responses: any = await Promise.all([
        await this.storage.put(params),
        await this.api.graphQlOperation({
          input: videoObject,
          mutation: this._factory.createMutation().createVideoObject(),
        }),
        await this.api.graphQlOperation({
          input: videoAsset,
          mutation: this._factory.createMutation().createVodAsset(),
        }),
      ]);
      const { key } = responses[0];
      const { createVideoObject } = responses[1].data;
      const { createVodAsset } = responses[2].data;
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
      const responses: any = await Promise.all([
        await this.api.graphQlOperation({
          input,
          mutation: this._factory.createMutation().deleteVideoObject(),
        }),
        await this.api.graphQlOperation({
          input,
          mutation: this._factory.createMutation().deleteVodAsset(),
        }),
      ]);
      await Promise.all(
        this.storage.extensions.map((extension) => this.storage.remove({
          filename: `${vodAssetVideoId}.${extension}`,
          config,
        })),
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
        const vodAssetResponse: any = await this.api.graphQlOperation({
          mutation: this._factory.createQuery().getVodAsset(),
          input: { id: vodAssetVideoId },
        });
        return vodAssetResponse;
      }
      const vodAssetResponse: any = await this.api.graphQlOperation({
        mutation: this._factory.createMutation().updateVodAsset(),
        input: { id: vodAssetVideoId, ...metadatadict },
      });
      return vodAssetResponse;
    } catch (error) {
      return this.logger.error(error);
    }
  }

  public async playback(vodAssetVideoId: string, config?: PlayerbackConfig) {
    const vodAssetResponse: any = await this.api.graphQlOperation({
      mutation: this._factory.createQuery().getVodAsset(),
      input: { id: vodAssetVideoId },
    });
    try {
      if (vodAssetResponse.data.getVodAsset === null) {
        this.logger.error('Vod asset video ID not found');
        return {
          data: null,
          error: 'Vod asset video ID not found',
        };
      }
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
    } catch (error) {
      return this.logger.error(error);
    }
  }

  public async record(streamName: string, provider: string) {
    const videoPlayers = window.document.getElementsByTagName('video');
    this.analytics.config = {
      streamName,
      provider,
    };
    Array.from(videoPlayers).forEach((videoPlayer) => {
      this.analytics.videoPlayer = videoPlayer;
      videoPlayer.addEventListener('play', () => this.analytics.play());
      videoPlayer.addEventListener('loadstart', () => null);
      videoPlayer.addEventListener('loadeddata', () => this.analytics.loadedData());
      videoPlayer.addEventListener('waiting', () => this.analytics.buffering());
      videoPlayer.addEventListener('canplaythrough', () => this.analytics.bufferCompleted());
      videoPlayer.addEventListener('timeupdate', () => null);
      videoPlayer.addEventListener('seeking', () => this.analytics.seeking());
      videoPlayer.addEventListener('seeked', () => this.analytics.seeked());
      videoPlayer.addEventListener('mediachange', () => this.analytics.step());
      videoPlayer.addEventListener('error', () => null);
      videoPlayer.addEventListener('pause', () => this.analytics.pause());
      videoPlayer.addEventListener('ended', () => null);
    });
  }
}
