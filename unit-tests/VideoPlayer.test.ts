import BaseAnalytics from '../src/Analytics/BaseAnalytics';
import { Player } from '../src/Interfaces';
import MockVideoJS from './MockVideoJS';
import VideoJS from './MockVideoJS';
jest.mock('../src/Analytics/VideoJS', () => {
  return function () {
    return MockVideoJS;
  };
});

describe('VideoJS Metrics', () => {
  let video: BaseAnalytics = null;
  beforeAll(() => {
    video = new VideoJS({});
  });

  it('play() method metrics', () => {
    video.loadedStarted();
    expect(video.play()).toMatchObject({
      MetricType: 'PLAY',
      at: 0,
      duration: 0,
      playlist_type: null,
    });
  });

  it('pause() method metrics', () => {
    expect(video.pause()).toMatchObject({
      MetricType: 'PAUSE',
      at: 0,
      duration: 0,
      playlist_type: null,
    });
  });

  it('buffering() method', () => {
    video.buffering(10);
    expect(video.currentVideo.isBuffering).toBe(true);
  });

  it('stop() method', () => {
    expect(video.stop(10)).toMatchObject({
      MetricType: 'STOP',
      at: 10,
      avg_bitrate: 0,
      connection_type: 'not available',
      duration: 0,
      fps: 0,
      package: null,
      playlist_type: null,
      resolution: null,
    });
  });
});

describe('VideoJS utilities', () => {
  let video: BaseAnalytics = null;
  beforeAll(() => {
    video = new VideoJS({});
  });

  it('getPlaylistType() method should return HLS', () => {
    const player: any = {
      tech: function () {
        return {
          vhs: {
            playlists: {
              media_: {
                playlistType: 'VOD',
              },
            },
          },
        };
      },
    };

    expect(video.getPlaylistType(player)).toBe('VOD');
  });

  it('getPlaylistType() method should return LIVE', () => {
    expect(video.getPlaylistType(null)).toBe('LIVE');
  });

  it('getPackageType() method should return UNSUPPORTED', () => {
    const player: any = {};
    expect(video.getPackageType(player)).toBe('UNSUPPORTED');
  });
});
