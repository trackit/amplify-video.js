import { aliasMutation } from '../../utils/graphql-test-utils';

describe('File upload', () => {
  it('Video.upload method', () => {
    cy.visit('/');
    const filepath = 'video/video-sample.mp4';
    cy.get('input[type="file"]').attachFile(filepath);
    cy.get('[data-cy=submit]').click();

    cy.intercept('/graphql', (req) => {
      aliasMutation(req, 'createVideoObject');
    });
    cy.intercept('/graphql', (req) => {
      aliasMutation(req, 'createVodAsset');
    });
    cy.intercept('PUT', '*PutObject').as('s3Put');

    cy.wait(['@createVideoObject', '@createVodAsset', '@s3Put']).spread(
      (createVideoObject, createVodAsset, s3Put) => {
        expect(
          createVideoObject.response.body.data.createVideoObject,
        ).to.not.equal(null);
        expect(createVodAsset.response.body.data.createVodAsset).to.not.equal(
          null,
        );
        expect(s3Put.response.statusCode).to.equal(200);
        cy.wait(1000);
        cy.get('[data-cy=pre-upload]')
          .invoke('html')
          .then((response) => {
            cy.wrap(response).as('response');
          });
        cy.get('@response').then((response) => {
          cy.writeFile(RESPONSE_FILE_PATH, response);
        });
      },
    );
  });
});
