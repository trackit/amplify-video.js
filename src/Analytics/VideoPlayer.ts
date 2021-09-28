import {
  CurrentVideo,
  CustomNavigator,
  Ended,
  ErrorOccured,
  LoadedData,
  Player,
  Seeked,
  Step,
  TimeUpdate,
  UpdateSeekStatus,
} from '../Interfaces';

abstract class VideoPlayer {
  private readonly _navigator: CustomNavigator;
  private _currentVideo: CurrentVideo;
  private _videoPlayer: HTMLMediaElement;
  private _connectionType;

  constructor() {
    this._navigator = navigator;
    this._currentVideo = this.resetVideo();
    this._connectionType = this.getConnectionType();
  }

  abstract play(playlistType?: string): void;
  abstract pause(): void;
  abstract ended(params: Ended): void;
  abstract stop(time?: number): void;
  abstract errorOccured(params: ErrorOccured): void;

  abstract loadedData(params: LoadedData): void;
  abstract loadedStarted(): void;

  abstract buffering(time: number): void;
  abstract bufferCompleted(): void;

  abstract step(params: Step): void;
  abstract timeUpdate(params: TimeUpdate): void;

  abstract seeked(params: Seeked): void;
  abstract seeking(): void;
  abstract updateSeekStatus(params: UpdateSeekStatus): void;

  get videoPlayer() {
    return this._videoPlayer;
  }

  set videoPlayer(videoPlayer: HTMLMediaElement) {
    this._videoPlayer = videoPlayer;
  }

  get currentVideo() {
    return this._currentVideo;
  }

  set currentVideo(value) {
    this._currentVideo = { ...this._currentVideo, ...value };
  }

  set connectionType(value) {
    this._connectionType = value;
  }

  get connectionType() {
    return this._connectionType;
  }

  protected getConnectionType(): Record<string, unknown> {
    const connection =
      this._navigator.connection ||
      this._navigator.mozConnection ||
      this._navigator.webkitConnection;
    return {
      type: connection
        ? connection.type || connection.effectiveType
        : 'not available',
      rtt: connection ? connection.rtt : -1,
    };
  }

  protected parseResolution(playbackAttr: Record<string, any>): string {
    return `${playbackAttr.RESOLUTION.width} x ${playbackAttr.RESOLUTION.height}`;
  }

  getPackageType(player: Player): string {
    try {
      return player.tech(true).vhs.masterPlaylistController_.sourceType_;
    } catch (e) {
      return 'UNSUPPORTED';
    }
  }

  getPlaylistType(player: Player): string {
    try {
      return player.tech(true).vhs.playlists.media_.playlistType;
    } catch (e) {
      return 'LIVE';
    }
  }

  private resetVideo(): CurrentVideo {
    return {
      previousTime: 0,
      currentTime: 0,
      seekStart: null,
      seekStartTime: 0,
      seekEndTime: 0,
      loadStarted: 0,
      dataLoaded: null,
      percentSeen: 0,
      packageType: null,
      avgBitrate: 0,
      duration: 0,
      resolution: null,
      frameRate: 0,
      bufferStarted: 0,
      isBuffering: false,
    };
  }
}

export default VideoPlayer;
