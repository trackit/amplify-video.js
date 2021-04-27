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

export interface MetadataDict {
  title: string;
  description: string;
  [key: string]: string;
}
