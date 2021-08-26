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
  [index: string]: (signedUrl: boolean) => string;
}

export interface Query {
  [index: string]: (signedUrl: boolean) => string;
}
