import { spawn } from 'child_process';

export default async function exec(command, args, verbose = true) {
  return new Promise((resolve, reject) => {
    const childProcess = spawn(command, args);
    let output = '';

    childProcess.stdout.on('data', (stdout) => {
      output += stdout.toString();
      if (verbose) {
        console.log(stdout.toString());
      }
    });

    childProcess.stderr.on('data', (stderr) => {
      console.log(stderr.toString());
    });

    childProcess.on('exit', () => {
      resolve(output);
    });

    childProcess.on('close', async (code) => {
      if (verbose) {
        console.log(`child process exited with code ${code}`);
      }
      if (code !== 0) {
        reject(new Error('Something went wrong, check above'));
      }
      resolve('');
    });
  });
}
