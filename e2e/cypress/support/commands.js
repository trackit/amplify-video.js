import 'cypress-localstorage-commands';
import 'cypress-file-upload';
const Auth = require('aws-amplify').Auth;
const username = Cypress.env('username');
const password = Cypress.env('password');
let awsconfig = {
  aws_project_region: null,
  aws_cognito_identity_pool_id: null,
  aws_cognito_region: null,
  aws_user_pools_id: null,
  aws_user_pools_web_client_id: null,
  aws_appsync_graphqlEndpoint: null,
  aws_appsync_region: null,
  aws_appsync_authenticationType: null,
};

const reduce = (obj) => {
  return Object.keys(obj).reduce((acc, arr) => {
    acc[arr] = Cypress.env(arr);
    return acc;
  }, {});
};

awsconfig = reduce(awsconfig);
console.log(awsconfig);
Auth.configure(awsconfig);

Cypress.Commands.add('signIn', () => {
  cy.then({ timeout: 60000 }, () => Auth.signIn(username, password)).then(
    (cognitoUser) => {
      const idToken = cognitoUser.signInUserSession.idToken.jwtToken;
      const accessToken = cognitoUser.signInUserSession.accessToken.jwtToken;

      const makeKey = (name) =>
        `CognitoIdentityServiceProvider.${cognitoUser.pool.clientId}.${cognitoUser.username}.${name}`;

      cy.setLocalStorage(makeKey('accessToken'), accessToken);
      cy.setLocalStorage(makeKey('idToken'), idToken);
      cy.setLocalStorage(
        `CognitoIdentityServiceProvider.${cognitoUser.pool.clientId}.LastAuthUser`,
        cognitoUser.username,
      );
    },
  );
  cy.saveLocalStorage();
});
