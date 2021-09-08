import VideoBase from '../../src/VideoBase';
import VideoClass from '../../src/Video';
jest.mock('../../src/VideoBase');

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  (VideoBase as jest.Mock<VideoBase>).mockClear();
});

describe('VideoClass', () => {
  it('The consumer should called the class constructor', () => {
    const videoBaseConsumer = new VideoClass();
    expect(VideoBase).toHaveBeenCalledTimes(1);
  });

  it('Does configure return config object', () => {
    const videoBaseConsumer = new VideoClass();
    expect(videoBaseConsumer.configure({ test: 'test' })).toEqual({
      test: 'test',
    });
  });

  it('Does static method getModuleName return "Video"', () => {
    expect(VideoClass.getModuleName()).toEqual('Video');
  });
});

describe('VideoBase members', () => {
  it('API members should be undefined before configure() call', () => {
    const videoBaseConsumer = new VideoClass();
    expect(videoBaseConsumer.api).toBeUndefined();
    expect(videoBaseConsumer.analytics).toBeUndefined();
    expect(videoBaseConsumer.storage).toBeUndefined();
    expect(videoBaseConsumer.auth).toBeUndefined();
  });

/*   it('API members should be undefined before configure() call', () => {
    const videoBaseConsumer = new VideoClass();
    videoBaseConsumer.configure("config");
    const mockVideoClassInstance = VideoBase.mock.instances[0];
    console.log(mockVideoClassInstance)
    const mockPlaySoundFile = mockVideoClassInstance.reduce;
    console.log(mockPlaySoundFile)
    // expect(mockPlaySoundFile).toHaveBeenCalledTimes(1);
  }); */
});
