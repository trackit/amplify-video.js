import { Mutation } from '../../Interfaces';

export default class TokenMutation implements Mutation {
  public createVideoObject() {
    return `
          mutation CreateVideoObject(
            $input: CreateVideoObjectInput!
            $condition: ModelVideoObjectConditionInput
          ) {
            createVideoObject(input: $input, condition: $condition) {
              id
              createdAt
              updatedAt
            }
          }
        `;
  }
  // TODO: Investigate TOKEN

  public createVodAsset() {
    return `
          mutation CreateVodAsset(
            $input: CreateVodAssetInput!
            $condition: ModelVodAssetConditionInput
          ) {
            createVodAsset(input: $input, condition: $condition) {
              id
              title
              description
              video {
                id
                createdAt
                updatedAt
              }
              createdAt
              updatedAt
            }
          }
        `;
  }

  public deleteVideoObject() {
    return `
          mutation DeleteVideoObject(
            $input: DeleteVideoObjectInput!
            $condition: ModelVideoObjectConditionInput
          ) {
            deleteVideoObject(input: $input, condition: $condition) {
              id
              createdAt
              updatedAt
            }
          }
        `;
  }

  public deleteVodAsset() {
    return `
          mutation DeleteVodAsset(
            $input: DeleteVodAssetInput!
            $condition: ModelVodAssetConditionInput
          ) {
            deleteVodAsset(input: $input, condition: $condition) {
              id
              title
              description
              video {
                id
                createdAt
                updatedAt
              }
              createdAt
              updatedAt
            }
          }
        `;
  }

  public updateVodAsset() {
    return `
          mutation UpdateVodAsset(
            $input: UpdateVodAssetInput!
            $condition: ModelVodAssetConditionInput
          ) {
            updateVodAsset(input: $input, condition: $condition) {
              id
              title
              description
              video {
                id
                createdAt
                updatedAt
              }
              createdAt
              updatedAt
            }
          }
        `;
  }
}
