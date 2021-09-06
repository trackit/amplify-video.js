import Amplify from '@aws-amplify/core';
import { Auth } from '@aws-amplify/auth';

class BaseAuth {
  private _instance: typeof Auth = undefined;
  private _config: any = undefined;

  constructor(config: any) {
    this._instance = Auth;
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

export default BaseAuth;
