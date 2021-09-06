import { v4 as uuidv4 } from 'uuid';
import { ConsoleLogger as Logger } from '@aws-amplify/core';
import Auth from './Auth/Auth';
import Storage from './Storage/Storage';
import Api from './Api/Api';
import BaseAnalytics from './Analytics/BaseAnalytics';
import VideoJS from './Analytics/VideoJS';

const video = {
  // vanilla: (config) => new Vanilla(config),
  videojs: (config) => new VideoJS(config),
};

class VideoBase {
  private _analytics: BaseAnalytics = undefined;
  private _storage: Storage = undefined;
  private _auth: Auth = undefined;
  private _api: Api = undefined;
  private _logger: Logger = undefined;

  configure(config: any) {
    this._logger = new Logger('VideoClass');
    this._analytics = video.videojs(config);
    this._auth = new Auth(config);
    this._storage = new Storage(config);
    this._api = new Api(config);
  }

  get analytics() {
    return this._analytics;
  }

  get uuid() {
    return uuidv4();
  }

  get logger() {
    return this._logger;
  }

  get storage() {
    return this._storage;
  }

  get auth() {
    return this._auth;
  }

  get api() {
    return this._api;
  }
}

export default VideoBase;
