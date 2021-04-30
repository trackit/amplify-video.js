export interface StorageConfig {
  region?: string;
  customPrefix?: {
    public?: string;
    private?: string;
    protected?: string;
  },
  level?: 'public' | 'private' | 'protected';
  bucket: string;
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
  createVideoObject(): string;
  createVodAsset(): string;
  deleteVideoObject(): string;
  deleteVodAsset(): string;
  updateVodAsset(): string;
}

export interface Query {
  getVodAsset(): string;
}

export interface AbstractFactory {
  createMutation(): Mutation;
  createQuery(): Query;
}
