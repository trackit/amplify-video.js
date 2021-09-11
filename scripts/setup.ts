import fs from 'fs';
import exec from './exec';

async function executeScripts() {
  try {
    console.log('\namplify init');
    // wait exec('bash', ['./scripts/headless/init-new-project.sh']);
    // console.log('\namplify add video');
    // await exec('bash', ['./scripts/headless/add-ivs.sh']);
    // await exec('bash', ['./scripts/headless/add-vod.sh']);
    // console.log('\namplify push');
    // await exec('bash', ['./scripts/headless/amplify-push.sh']);
  } catch (error) {
    // await exec('bash', ['./scripts/headless/amplify-delete.sh']);
    throw new Error(error);
  }
}

export default async function setup() {
  if (process.argv.includes('-unit')) {
    console.log(
      '\nunit:test mode, only the tests from the tests/unit-tests folder will be executed',
    );
    return;
  }
  // Jest automatically set NODE_ENV to test if it's not already set to something else.
  if (process.env.NODE_ENV === 'test') {
    await executeScripts();
    return;
  }
  const directoryPath = `${__dirname}/../${process.env.AMP_PATH}/amplify`;
  if (!fs.existsSync(directoryPath)) {
    throw new Error(
      `No amplify project found, make sure to set AMP_PATH with correct path.\nActual path: ${directoryPath}`,
    );
  }
}
