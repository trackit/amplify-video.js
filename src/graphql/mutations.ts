export default {
  createVideoObject: (signedUrl: boolean) => `
    mutation CreateVideoObject(
      $input: CreateVideoObjectInput!
      $condition: ModelVideoObjectConditionInput
    ) {
      createVideoObject(input: $input, condition: $condition) {
        id
        ${signedUrl ? 'token' : ''}
        createdAt
        updatedAt
      }
    }
  `,
  createVodAsset: (signedUrl: boolean) => `
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
          ${signedUrl ? 'token' : ''}
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
    }
  `,
  deleteVideoObject: (signedUrl: boolean) => `
    mutation DeleteVideoObject(
      $input: DeleteVideoObjectInput!
      $condition: ModelVideoObjectConditionInput
    ) {
      deleteVideoObject(input: $input, condition: $condition) {
        id
        ${signedUrl ? 'token' : ''}
        createdAt
        updatedAt
      }
    }
  `,
  deleteVodAsset: (signedUrl: boolean) => `
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
          ${signedUrl ? 'token' : ''}
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
    }
  `,
  updateVodAsset: (signedUrl: boolean) => `
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
          ${signedUrl ? 'token' : ''}
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
    }
  `,
};
