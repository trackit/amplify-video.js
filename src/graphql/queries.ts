export default {
  getVodAsset: (signedUrl: boolean) => `
    query GetVodAsset($id: ID!) {
      getVodAsset(id: $id) {
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
