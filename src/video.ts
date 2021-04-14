export default class Video {
  private test: string = 'test string';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  upload(_videoFileReferance: string, _metadadict: any) {
    return this.test;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  delete(_vodAssetVideoId: string) {
    return this.test;
  }
}
