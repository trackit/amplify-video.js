import VideoBase from '../../src/VideoBase';
import VideoClass from '../../src/Video';
jest.mock('../../src/VideoBase');

beforeEach(() => {
  (VideoBase as jest.Mock<VideoBase>).mockClear();
});

it('The consumer should call the class constructor', () => {
  new VideoClass();
  expect(VideoBase).toHaveBeenCalledTimes(1);
});

it('configure should return config object', () => {
  const videoBaseConsumer = new VideoClass();
  expect(videoBaseConsumer.configure({ test: 'test' })).toEqual({
    test: 'test',
  });
});

it('static method getModuleName should return "Video"', () => {
  expect(VideoClass.getModuleName()).toEqual('Video');
});

it('configure method should call parent class configure method', () => {
  const videoClass = new VideoClass();
  videoClass.configure({ config: 'test' });
  const mockVideoClassInstance = (VideoBase as jest.Mock).mock.instances[0];
  expect(mockVideoClassInstance.configure).toHaveBeenLastCalledWith({
    config: 'test',
  });
});
