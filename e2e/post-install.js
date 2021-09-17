const ejs = require('ejs');
const fs = require('fs');

function fix_key(key) {
  return key.replace(key, `CYPRESS_${key}`);
}

function pickEnvFile(path) {
  if (!fs.existsSync(path)) {
    console.log(
      'cypress.env.json does not exist, considering in CI mode, using process.env',
    );
    return process.env;
  }
  const env = JSON.parse(fs.readFileSync(path, { encoding: 'utf-8' }));
  return Object.assign(
    {},
    ...Object.keys(env).map((key) => ({ [fix_key(key)]: env[key] })),
  );
}

function generateAwsExports(path) {
  if (fs.existsSync(path)) {
    console.log(`${path} file already exist. Skipping...`);
    return;
  }
  console.log(`Generating ${path} file`);
  const template = fs.readFileSync(`${path}.ejs`, {
    encoding: 'utf-8',
  });
  const awsExports = ejs.render(
    template,
    pickEnvFile(`${__dirname}/cypress.env.json`),
  );
  fs.writeFileSync(path, awsExports);
}

generateAwsExports(`${__dirname}/src/aws-exports.js`);
generateAwsExports(`${__dirname}/src/aws-video-exports.js`);
