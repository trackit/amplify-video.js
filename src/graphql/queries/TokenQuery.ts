import { Query } from '../../video.interface';

export default class TokenQuery implements Query {
  public getVodAsset() {
    return `
    query GetVodAsset($id: ID!) {
      getVodAsset(id: $id) {
        id
        title
        description
        video {
          id
          createdAt
          updatedAt
          token
        }
        createdAt
        updatedAt
      }
    }
  `;
  }
}
