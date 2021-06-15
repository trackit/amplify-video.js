import Amplify from '@aws-amplify/core';
import { API } from '@aws-amplify/api';

class BaseApi {
  private _instance: typeof API = undefined;
  private _config: any = undefined;

  constructor(config: any) {
    this._instance = API;
    this._config = config;
    this.configure();
  }

  get config() {
    return this._config;
  }

  get instance() {
    return this._instance;
  }

  public configure() {
    Amplify.register(this._instance);
  }
}

export default BaseApi;
