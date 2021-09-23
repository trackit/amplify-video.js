import { RESPONSE_FILE_PATH } from '../utils/constant';
import { aliasMutation } from '../utils/graphql-test-utils';

describe('File upload', () => {
  it('Video.upload method', () => {
    cy.visit('/');
    const filepath = 'video/video-sample.mp4';
    cy.get('input[type="file"]').attachFile({
      filePath: filepath,
      encoding: 'binary',
    });
    cy.get('[data-cy=submit]').click();

    cy.intercept('/graphql', (req) => {
      aliasMutation(req, 'createVideoObject');
    });
    cy.intercept('/graphql', (req) => {
      aliasMutation(req, 'createVodAsset');
    });
    cy.intercept('PUT', '*PutObject').as('s3Put');

    cy.wait(['@createVideoObject', '@createVodAsset', '@s3Put'], {
      responseTimeout: 60000,
    }).spread((createVideoObject, createVodAsset, s3Put) => {
      expect(
        createVideoObject.response.body.data.createVideoObject,
      ).to.not.equal(null);
      expect(createVodAsset.response.body.data.createVodAsset).to.not.equal(
        null,
      );
      expect(s3Put.response.statusCode).to.equal(200);
      cy.wait(1000);
      cy.get('[data-cy=pre-upload]')
        .invoke('text')
        .then((response) => {
          cy.wrap(response).as('response');
        });
      cy.get('@response').then((response) => {
        cy.writeFile(RESPONSE_FILE_PATH, response);
      });
    });
  });

  it('Video.upload method should throw an error', () => {
    cy.visit('/');
    const filepath = 'video/text-file.txt';
    cy.get('input[type="file"]').attachFile(filepath);
    cy.get('[data-cy=submit]').click();

    cy.wait(1000);
    cy.get('[data-cy=pre-upload]')
      .invoke('text')
      .then((content) => {
        const { data } = JSON.parse(content);
        expect(data).to.have.ownProperty('createVideoObject');
        expect(data).to.have.ownProperty('createVodAsset');
        expect(data).to.have.ownProperty('key');
        expect(data.createVideoObject).to.equal(null);
        expect(data.createVodAsset).to.equal(null);
        expect(data.key).to.have.equal(null);
      });
  });
});
