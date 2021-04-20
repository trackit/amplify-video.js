import VideoClass from './src/video';

let instance: VideoClass = null;

if (!instance) {
  instance = new VideoClass();
}

const Video = instance;

export default Video;
