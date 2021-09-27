// This file intends to create/update secrets on Github repository

const fs = require('fs');
const { exec } = require('child_process');

function run(cmd) {
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
}

function addGithubSecret(path, repository) {
  const data = JSON.parse(fs.readFileSync(path, { encoding: 'utf-8' }));

  Object.keys(data).map((key) => {
    run(`gh secret set ${key} -R ${repository} -b ${data[key]}`);
  });
}

addGithubSecret('cypress.env.json', 'trackit/amplify-video.js');
