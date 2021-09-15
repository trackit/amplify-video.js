const ejs = require('ejs');
const fs = require('fs');

function generateAwsExports(path) {
  if (fs.existsSync(path)) return;
  const template = fs.readFileSync(`${path}.ejs`, {
    encoding: 'utf-8',
  });
  const awsExports = ejs.render(template, process.env);
  fs.writeFileSync(path, awsExports);
}

generateAwsExports(`${__dirname}/src/aws-exports.js`);
generateAwsExports(`${__dirname}/src/aws-video-exports.js`);
