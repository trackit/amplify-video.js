import Amplify from '@aws-amplify/core';
import VideoBase from './VideoBase';
import { MetadataDict, PlaybackConfig, StorageConfig } from './Interfaces';
import NotFoundException from './Exception/NotFoundError';

export default class VideoClass extends VideoBase {
  private _config: any;

  constructor() {
    super();
    this._config = {};
  }

  public configure(config?: any) {
    super.configure(config);
    this._config = config;
    Amplify.configure(config); // Be carefull here, it can create circular deps
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
      this.storage.checkFileFormat(params.file);
      const responses: any = await Promise.all([
        await this.api.graphQlOperation({
          input: videoObject,
          mutation: this.mutations.createVideoObject,
        }),
        await this.api.graphQlOperation({
          input: videoAsset,
          mutation: this.mutations.createVodAsset,
        }),
        await this.storage.put(params),
      ]);
      const { createVideoObject } = responses[0].data;
      const { createVodAsset } = responses[1].data;
      const { key } = responses[2];
      return {
        data: {
          createVideoObject,
          createVodAsset,
          key,
        },
      };
    } catch (error) {
      this.logger.error(error);
      return {
        data: {
          createVideoObject: null,
          createVodAsset: null,
          key: null,
        },
      };
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
          mutation: this.mutations.deleteVideoObject,
        }),
        await this.api.graphQlOperation({
          input,
          mutation: this.mutations.deleteVodAsset,
        }),
      ]);
      await Promise.all(
        this.storage.extensions.map((extension) =>
          this.storage.remove({
            filename: `${vodAssetVideoId}.${extension}`,
            config,
          }),
        ),
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
      if (!metadatadict) {
        const vodAssetResponse: any = await this.api.graphQlOperation({
          mutation: this.queries.getVodAsset,
          input: { id: vodAssetVideoId },
        });
        if (!vodAssetResponse.data.getVodAsset)
          throw new NotFoundException('Vod asset video ID not found');
        return vodAssetResponse;
      }
      const vodAssetResponse: any = await this.api.graphQlOperation({
        mutation: this.mutations.updateVodAsset,
        input: { input: { id: vodAssetVideoId, ...metadatadict } },
      });
      return vodAssetResponse;
    } catch (error) {
      this.logger.error(error);
      return {
        data: {
          updateVodAsset: null,
        },
      };
    }
  }

  public async playback(vodAssetVideoId: string, config: PlaybackConfig) {
    const vodAssetResponse: any = await this.api.graphQlOperation({
      mutation: this.queries.getVodAsset,
      input: { id: vodAssetVideoId },
    });
    try {
      if (!vodAssetResponse.data.getVodAsset) {
        this.logger.error('Vod asset video ID not found');
        return {
          data: {
            playbackUrl: null,
            error: 'Vod asset video ID not found',
          },
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

  public async record(streamName: string, provider: string, instance: any) {
    this.analytics.config = {
      streamName,
      provider,
    };
    const { player } = instance;
    player.on('play', () =>
      this.analytics.play(this.analytics.getPlaylistType(player)),
    );
    player.on('loadstart', () => {
      this.analytics.loadedStarted();
    });
    player.on('loadeddata', () => {
      this.analytics.loadedData({
        duration: player.duration(),
        packageType: this.analytics.getPackageType(player),
        playbackAttr: player.tech().vhs.playlists.media_.attributes,
      });
      console.log('currentVideo', this.analytics.currentVideo);
    });
    player.on('waiting', () => {
      this.analytics.buffering(player.currentTime());
    });
    player.on('canplaythrough', () => {
      this.analytics.bufferCompleted();
    });
    player.on('timeupdate', () => {
      const intPlayedTime = parseInt(player.currentTime(), 10);
      const everyFiveSec = intPlayedTime % 5 === 0 && intPlayedTime !== 0;
      // process it only every 5 seconds.
      if (everyFiveSec) {
        this.analytics.timeUpdate({
          duration: player.duration(),
          time: player.currentTime(),
        });
      }
    });
    player.on('seeking', () => this.analytics.seeking());
    player.on('seeked', () => {
      this.analytics.seeked({
        currentTime: player.currentTime(),
      });
    });
    player.on('mediachange', () => {
      this.analytics.step({
        playbackAttr: player.tech(true).vhs.playlists.media_.attributes,
        packageType: this.analytics.getPackageType(player),
        time: player.currentTime(),
      });
    });
    player.on('error', (err) => {
      this.analytics.errorOccured({
        time: player.currentTime(),
        error: err,
      });
    });
    player.on('pause', () => this.analytics.pause());
    player.on('ended', () => {
      this.analytics.ended({
        currentTime: player.currentTime(),
        duration: player.duration(),
      });
    });
  }
}
