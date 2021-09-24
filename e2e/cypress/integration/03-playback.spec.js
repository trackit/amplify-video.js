import { RESPONSE_FILE_PATH, PLAYBACK_URL_FILE_PATH } from '../utils/constant';
import { aliasMutation } from '../utils/graphql-test-utils';

describe('Generate playback url', () => {
  beforeEach(() => {
    cy.intercept('/graphql', (req) => {
      aliasMutation(req, 'getVodAsset');
    });
  });

  it('should generate playback url with token property if signed url', () => {
    let id = null;
    cy.visit('/');
    cy.readFile(RESPONSE_FILE_PATH).then(({ data }) => {
      id = data.key.split('.')[0];
      cy.get('[data-cy=playback-input]').type(id);
      cy.get('[data-cy=playback]').click();
    });
    cy.wait('@getVodAsset').then(() => {
      cy.wait(1000);
      cy.get('[data-cy=pre-playback]')
        .invoke('text')
        .then((content) => {
          const { data } = JSON.parse(content);
          expect(data).to.not.equal(null);
          expect(data).to.have.ownProperty('playbackUrl');
          if (data.token) expect(data.token).to.include('?Policy=ey');
          cy.writeFile(PLAYBACK_URL_FILE_PATH, JSON.parse(content));
        });
    });
  });

  it('should return an error response', () => {
    cy.visit('/');
    cy.get('[data-cy=playback-input]').type('fake_id');
    cy.get('[data-cy=playback]').click();
    cy.wait('@getVodAsset').then(() => {
      cy.wait(1000);
      cy.get('[data-cy=pre-playback]')
        .invoke('text')
        .then((content) => {
          const { data } = JSON.parse(content);
          expect(data).to.not.equal(null);
          expect(data).to.have.ownProperty('playbackUrl');
          expect(data).to.have.ownProperty('error');
          expect(data.playbackUrl).to.equal(null);
          expect(data.error).to.equal('Vod asset video ID not found');
        });
    });
  });
});
