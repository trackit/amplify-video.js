/* eslint-disable @typescript-eslint/lines-between-class-members */
import Amplify, { Storage } from 'aws-amplify';

export default class VideoClass {
  private videoConfig = null;
  private amplifyConfig = null;

  public configure(config, videoConfig) {
    this.amplifyConfig = Amplify.configure(config);
    this.videoConfig = videoConfig;
    console.log(Amplify);
  }

  public async upload(file, config?) {
    config = {
      bucket: this.videoConfig.awsInputVideo,
      region: this.amplifyConfig.aws_project_region,
      customPrefix: {
        public: '',
      },
      ...config,
    };
    // -> TODO: GraphQL
    return Storage.put(file.name, file, config);
  }

  public async delete(asset: string, config?) {
    config = {
      bucket: this.videoConfig.awsInputVideo,
      region: this.amplifyConfig.aws_project_region,
      ...config,
    };

    // TODO: GraphQL
    return Storage.remove(asset, config);
  }
}
