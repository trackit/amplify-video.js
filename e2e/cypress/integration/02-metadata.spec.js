import { RESPONSE_FILE_PATH } from '../utils/constant';
import { aliasMutation } from '../utils/graphql-test-utils';

describe('Fetching metadata', () => {
  beforeEach(() => {
    cy.intercept('/graphql', (req) => {
      aliasMutation(req, 'getVodAsset');
    });
  });

  it('Video.metadata method should return null when id does not exist', () => {
    cy.visit('/');
    cy.readFile(RESPONSE_FILE_PATH).then(({ data }) => {
      cy.get('[data-cy=fetch-input]').type(data.key);
      cy.get('[data-cy=fetch]').click();
    });
    cy.wait('@getVodAsset').then(({ response }) => {
      const { getVodAsset } = response.body.data;
      expect(getVodAsset).to.equal(null);
    });
  });

  it('Video.metadata method should return VodAsset metadata', () => {
    let id = null;
    cy.visit('/');
    cy.readFile(RESPONSE_FILE_PATH).then(({ data }) => {
      id = data.key.split('.')[0];
      cy.get('[data-cy=fetch-input]').type(id);
      cy.get('[data-cy=fetch]').click();
    });
    cy.wait('@getVodAsset').then(({ response }) => {
      const { getVodAsset } = response.body.data;
      expect(getVodAsset).to.not.equal(null);
      expect(expect(getVodAsset.id).to.equal(id));
    });
  });
});

describe('Update metadata', () => {
  beforeEach(() => {
    cy.intercept('/graphql', (req) => {
      aliasMutation(req, 'updateVodAsset');
    });
  });
  it('Video.metadata method should update and return VodAsset metadata', () => {
    let id = null;
    cy.visit('/');
    cy.readFile(RESPONSE_FILE_PATH).then(({ data }) => {
      id = data.key.split('.')[0];
      cy.get('[data-cy=update-input]').type(id);
      cy.get('[data-cy=update]').click();
    });
    cy.wait('@updateVodAsset').then(({ response }) => {
      const { updateVodAsset } = response.body.data;
      expect(updateVodAsset).to.not.equal(null);
      expect(expect(updateVodAsset.id).to.equal(id));
    });
  });
});
