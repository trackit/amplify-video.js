import exec from './exec';

export default async function teardown() {
  // Jest automatically set NODE_ENV to test if it's not already set to something else.
  if (process.argv.includes('-unit') || process.env.NODE_ENV !== 'test') {
    return;
  }
  console.log('amplify delete --force');
  // await exec('bash', ['./scripts/headless/amplify-delete.sh']);
}
