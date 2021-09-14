import * as AWS from 'aws-sdk';
import Amplify, { Auth } from 'aws-amplify';
import Video from '../..';

export async function loadAmplifyConfig() {
  const awsconfig = await import(
    `../../${process.env.AMP_PATH}/src/aws-exports`
  );
  try {
    Amplify.configure(awsconfig.default);
    Video.configure(awsconfig.default);
    return awsconfig.default;
  } catch (error) {
    console.log('error', error);
  }
}

export async function signUp({ credentials }) {
  try {
    await Auth.signUp({
      ...credentials,
      attributes: {
        email: 'nathan@trackit.io',
      },
    });
  } catch (error) {
    if (error.code === 'UsernameExistsException') return;
    console.error('error signing up:', error);
  }
}

export async function signIn({ credentials }) {
  try {
    await Auth.signIn({ ...credentials });
  } catch (error) {
    console.log('error signing in:', error);
  }
}

export async function confirmUserAndVerify({ region, userPoolId, username }) {
  const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider(
    {
      apiVersion: '2016-04-18',
      region,
    },
  );

  try {
    cognitoidentityserviceprovider.adminConfirmSignUp({
      UserPoolId: userPoolId,
      Username: username,
    });
  } catch (error) {
    console.error('error confirming user:', error);
  }
}

export async function addUserToGroup({ userPoolId, group, region }) {
  const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider(
    {
      apiVersion: '2016-04-18',
      region,
    },
  );

  const groupParams = {
    GroupName: group,
    UserPoolId: userPoolId,
  };
  const addUserParams = {
    GroupName: group,
    UserPoolId: userPoolId,
    Username: 'test',
  };
  /**
   * Check if the group exists; if it doesn't, create it.
   */
  try {
    await cognitoidentityserviceprovider.getGroup(groupParams).promise();
  } catch (e) {
    await cognitoidentityserviceprovider.createGroup(groupParams).promise();
  }
  /**
   * Then, add the user to the group.
   */
  await cognitoidentityserviceprovider
    .adminAddUserToGroup(addUserParams)
    .promise();
}

export async function deleteUser({ username, region, userPoolId }) {
  const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider(
    {
      apiVersion: '2016-04-18',
      region,
    },
  );
  try {
    await cognitoidentityserviceprovider
      .adminDeleteUser({
        UserPoolId: userPoolId,
        Username: username,
      })
      .promise();
  } catch (error) {
    console.error('error deleting user', error);
  }
}
