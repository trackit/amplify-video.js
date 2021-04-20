export interface StorageConfig {
  region?: string;
  customPrefix?: {
    public?: string;
    private?: string;
    protected?: string;
  },
  level?: 'public' | 'private' | 'protected';
  bucket: string;
}
