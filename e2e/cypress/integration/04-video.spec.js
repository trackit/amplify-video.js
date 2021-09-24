import { PLAYBACK_URL_FILE_PATH } from '../utils/constant';
import { aliasMutation } from '../utils/graphql-test-utils';

describe('Generate playback url', () => {
  beforeEach(() => {
    /* cy.intercept('/graphql', (req) => {
      aliasMutation(req, 'getVodAsset');
    }); */
  });

  it('should generate playback url with token property if signed url', () => {
    let id = null;
    cy.visit('/');
    cy.wait(12000); // WAIT FOR MEDIACONVERT JOB
    cy.readFile(PLAYBACK_URL_FILE_PATH).then(({ data }) => {
      cy.intercept(data.playbackUrl + data.token).as('HLS');
      cy.get('[data-cy=video-url-input]').type(data.playbackUrl);
      cy.get('[data-cy=video-token-input]').type(data.token);
      cy.get('[data-cy=player]').click();
      cy.wait('@HLS').its('response.statusCode').should('eq', 200)
    });
  });
});
