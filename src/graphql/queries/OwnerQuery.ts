import { Query } from '../../video.interface';

export default class OwnerQuery implements Query {
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
          owner
        }
        createdAt
        updatedAt
        owner
      }
    }
  `;
  }
}
