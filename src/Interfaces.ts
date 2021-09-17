import videojs from 'video.js';

export interface StorageConfig {
  region?: string;
  customPrefix?: {
    public?: string;
    private?: string;
    protected?: string;
  };
  level?: 'public' | 'private' | 'protected';
  bucket: string;
  progressCallback?: any;
  contentType: string;
}

export interface PlayerbackConfig {
  awsOutputVideo: string;
}

export interface MetadataDict {
  title: string;
  description: string;
  [key: string]: string;
}

export interface Mutation {
  [index: string]: string;
}

export interface Query {
  [index: string]: string;
}

export enum MetricType {
  PLAY = 'PLAY',
  FIRSTFRAME = 'FIRSTFRAME',
  SEEK = 'SEEK',
  BUFFER = 'BUFFER',
  STREAM = 'STREAM',
  STEP = 'STEP',
  PAUSE = 'PAUSE',
  ERROR = 'ERROR',
  STOP = 'STOP',
}

export interface CurrentVideo {
  videoId: string;
  previousTime: number;
  currentTime: number;
  seekStart: null | number;
  seekStartTime: number;
  seekEndTime: number;
  loadStarted: number;
  dataLoaded: null | number;
  percentSeen: number;
  packageType: null;
  avgBitrate: number;
  duration: number;
  resolution: null | string;
  frameRate: number;
  bufferStarted: number;
  isBuffering: boolean;
}

export interface CustomNavigator extends Navigator {
  mozConnection?: any;
  webkitConnection?: any;
}

export interface LoadedData {
  packageType: any;
  playbackAttr: any;
  duration: number;
}

export interface Step {
  playbackAttr: any;
  packageType: string;
  time: number;
}

export interface TimeUpdate {
  time: number;
  duration: number;
}

export interface Seeked {
  currentTime: number;
}

export interface UpdateSeekStatus {
  currentTime: number;
  timeTakenToSeek: number;
}

export interface Ended {
  currentTime: number;
  duration: number;
}

export interface ErrorOccured {
  time: number;
  error?: any;
}

export interface Player extends videojs.Player {
  tech: any;
}
