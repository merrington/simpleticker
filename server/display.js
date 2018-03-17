const { spawn, exec } = require('child_process');
let displayProcess;

export async function loading() {
  // await clearDisplay();
  const command = `sudo ./bin/led-image-viewer -D70 ws-loading.gif --led-rows=16 --led-chain=3`
  displayProcess = spawn(command.split(' ')[0], command.split(' ').slice(1));
}

export function clearDisplay() {
  console.log('about to kill a process');
  return new Promise((resolve, reject) => {
    const command = `sudo kill $(ps aux | grep 'server/bin' | awk '{print $2}')`;
    exec("ps aux | grep 'server/bin' | awk '{print $2}'", (err, stdout, stderr) => {
      console.log('stdout', stdout);
      console.log('stderr', stderr);
    })
    exec(command, () => {
      console.log('process has been killed');
      resolve();
    });
  });
}

export async function scroll(filename) {
  // await clearDisplay();
  const command = `sudo ./bin/demo -D 1 -m 35 ${filename} --led-rows=16 --led-chain=3`
  displayProcess = spawn(command.split(' ')[0], command.split(' ').slice(1));
}
