const hasOperationName = (req, operationName) => {
  const { body } = req;
  return body.hasOwnProperty('query') && body.query.includes(operationName);
};

const aliasMutation = (req, operationName) => {
  if (hasOperationName(req, operationName)) {
    req.alias = operationName;
  }
};

const responseAssertion = (interception, target) => {
  expect(interception.response.body.data[target]).to.not.equal(null);
};

describe('File upload', () => {
  before(() => {
    cy.signIn();
  });

  after(() => {
    cy.clearLocalStorageSnapshot();
    cy.clearLocalStorage();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

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
        responseAssertion(createVideoObject, 'createVideoObject');
        responseAssertion(createVodAsset, 'createVodAsset');
        expect(s3Put.response.statusCode).to.equal(200);
      },
    );
  });
});
