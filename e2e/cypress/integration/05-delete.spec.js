import { RESPONSE_FILE_PATH } from '../utils/constant';
import { aliasMutation } from '../utils/graphql-test-utils';

describe('Delete metadata', () => {
  beforeEach(() => {
    cy.intercept('/graphql', (req) => {
      aliasMutation(req, 'deleteVodAsset');
      aliasMutation(req, 'deleteVideoObject');
    });
  });

  it('Video.delete method should return mutation results', () => {
    let id = null;
    cy.visit('/');
    cy.readFile(RESPONSE_FILE_PATH).then(({ data }) => {
      id = data.key.split('.')[0];
      cy.get('[data-cy=delete-input]').type(id);
      cy.get('[data-cy=delete]').click();
    });
    cy.wait(['@deleteVideoObject', '@deleteVodAsset']).spread(
      (deleteVideoObject, deleteVodAsset) => {
        expect(
          deleteVideoObject.response.body.data.deleteVideoObject,
        ).to.not.equal(null);
        expect(deleteVodAsset.response.body.data.deleteVodAsset).to.not.equal(
          null,
        );
      },
    );
  });

  it('Video.delete return null if not result found', () => {
    cy.visit('/');
    cy.get('[data-cy=delete-input]').type('unexisting_id');
    cy.get('[data-cy=delete]').click();
    cy.wait(['@deleteVideoObject', '@deleteVodAsset']).spread(
      (deleteVideoObject, deleteVodAsset) => {
        expect(
          deleteVideoObject.response.body.data.deleteVideoObject,
        ).to.equal(null);
        expect(deleteVodAsset.response.body.data.deleteVodAsset).to.equal(
          null,
        );
      },
    );
  });
});
