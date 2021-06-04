import { Mutation } from '../../Interfaces';

export default class TokenMutation implements Mutation {
  public createVideoObject() {
    return `
          mutation CreateVideoObject(
            $input: CreateVideoObjectInput!
            $condition: ModelvideoObjectConditionInput
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
            $condition: ModelvodAssetConditionInput
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
            $condition: ModelvideoObjectConditionInput
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
            $condition: ModelvodAssetConditionInput
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
            $condition: ModelvodAssetConditionInput
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
