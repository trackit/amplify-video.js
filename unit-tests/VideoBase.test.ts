import VideoBase from '../../src/VideoBase';
import Auth from '../../src/Auth/Auth';
import Api from '../../src/Api/Api';
import Storage from '../../src/Storage/Storage';
import VideoJS from '../../src/Analytics/VideoJS';
import mutations from '../../src/graphql/mutations';
import queries from '../../src/graphql/queries';

jest.mock('../../src/Auth/Auth');
jest.mock('../../src/Storage/Storage');
jest.mock('../../src/Api/Api');
jest.mock('../../src/Analytics/VideoJS');

beforeEach(() => {
  (Auth as jest.Mock<Auth>).mockClear();
  (Storage as jest.Mock<Storage>).mockClear();
  (Api as jest.Mock<Api>).mockClear();
  (VideoJS as jest.Mock<VideoJS>).mockClear();
});

describe('VideoBase configure()', () => {
  const config = { config: 'test' };
  it('Auth constructor should be call', () => {
    const videoBase = new VideoBase();
    videoBase.configure(config);
    expect(Auth).toHaveBeenCalledWith(config);
  });

  it('Storage constructor should be call', () => {
    const videoBase = new VideoBase();
    videoBase.configure(config);
    expect(Storage).toHaveBeenCalledWith(config);
  });

  it('Api constructor should be call', () => {
    const videoBase = new VideoBase();
    videoBase.configure(config);
    expect(Api).toHaveBeenCalledWith(config);
  });

  it('VideoJS constructor should be call', () => {
    const videoBase = new VideoBase();
    videoBase.configure(config);
    expect(VideoJS).toHaveBeenCalledWith(config);
  });
});

describe('VideoBase reduce() - Mutations whithout signedUrl', () => {
  const videoBase = new VideoBase();
  videoBase.configure({ signedUrl: false });

  it('Reduce should return createVideoObject mutation', () => {
    expect(videoBase.mutations.createVideoObject).toBe(
      mutations.createVideoObject(false),
    );
  });

  it('Reduce should return createVodAsset mutation', () => {
    expect(videoBase.mutations.createVodAsset).toBe(
      mutations.createVodAsset(false),
    );
  });

  it('Reduce should return deleteVideoObject mutation', () => {
    expect(videoBase.mutations.deleteVideoObject).toBe(
      mutations.deleteVideoObject(false),
    );
  });

  it('Reduce should return deleteVodAsset mutation', () => {
    expect(videoBase.mutations.deleteVodAsset).toBe(
      mutations.deleteVodAsset(false),
    );
  });

  it('Reduce should return updateVodAsset mutation', () => {
    expect(videoBase.mutations.updateVodAsset).toBe(
      mutations.updateVodAsset(false),
    );
  });
});

describe('VideoBase reduce() - Mutations whith signedUrl', () => {
  const videoBase = new VideoBase();
  videoBase.configure({ signedUrl: true });

  it('Reduce should return createVideoObject mutation', () => {
    expect(videoBase.mutations.createVideoObject).toBe(
      mutations.createVideoObject(true),
    );
  });

  it('Reduce should return createVodAsset mutation', () => {
    expect(videoBase.mutations.createVodAsset).toBe(
      mutations.createVodAsset(true),
    );
  });

  it('Reduce should return deleteVideoObject mutation', () => {
    expect(videoBase.mutations.deleteVideoObject).toBe(
      mutations.deleteVideoObject(true),
    );
  });

  it('Reduce should return deleteVodAsset mutation', () => {
    expect(videoBase.mutations.deleteVodAsset).toBe(
      mutations.deleteVodAsset(true),
    );
  });

  it('Reduce should return updateVodAsset mutation', () => {
    expect(videoBase.mutations.updateVodAsset).toBe(
      mutations.updateVodAsset(true),
    );
  });
});

describe('VideoBase reduce() - Queries whithout signedUrl', () => {
  const videoBase = new VideoBase();
  videoBase.configure({ signedUrl: true });

  it('Reduce should return createVideoObject mutation', () => {
    expect(videoBase.queries.getVodAsset).toBe(queries.getVodAsset(true));
  });
});

describe('VideoBase reduce() - Queries with signedUrl', () => {
  const videoBase = new VideoBase();
  videoBase.configure({ signedUrl: false });

  it('Reduce should return createVideoObject mutation', () => {
    expect(videoBase.queries.getVodAsset).toBe(queries.getVodAsset(false));
  });
});
