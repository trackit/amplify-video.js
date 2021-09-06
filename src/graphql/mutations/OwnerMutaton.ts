import { Mutation } from '../../Interfaces';

export default class OwnerMutation implements Mutation {
  public createVideoObject() {
    return `
          mutation CreateVideoObject(
            $input: CreateVideoObjectInput!
            $condition: ModelVideoObjectConditionInput
          ) {
            createVideoObject(input: $input, condition: $condition) {
              id
              owner
              createdAt
              updatedAt
            }
          }
        `;
  }

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
                owner
                createdAt
                updatedAt
              }
              createdAt
              updatedAt
              owner
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
              owner
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
                owner
                createdAt
                updatedAt
              }
              createdAt
              updatedAt
              owner
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
                owner
                createdAt
                updatedAt
              }
              createdAt
              updatedAt
              owner
            }
          }
        `;
  }
}