import { ConsoleLogger as Logger } from '@aws-amplify/core';
import VideoClass from './src/video';

const logger = new Logger('Video');

let instance: VideoClass = null;

if (!instance) {
  logger.debug('Create Video Instance');
  instance = new VideoClass();
}

const Video = instance;

export default Video;
