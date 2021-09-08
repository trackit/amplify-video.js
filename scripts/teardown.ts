import exec from './exec';

export default async function teardown() {
  if (process.argv.includes('-unit')) {
    return;
  }
  console.log('amplify delete --force');
  // await exec('bash', ['./scripts/headless/amplify-delete.sh']);
}
