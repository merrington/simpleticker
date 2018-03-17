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
    exec("ps aux | grep 'server/bin' | awk '{print $2} | awk 'FNR==2'", (err, stdout, stderr) => {
      exec(`sudo kill ${stdout}`, (err2, stdout2, stderr2) => {
        console.log('process has been killed');
        console.log('err', err, err2);
        console.log('stdout', stdout, stdout2);
        console.log('stderr', stderr, stderr2);
        resolve();
      });
    })
  });
}

export async function scroll(filename) {
  // await clearDisplay();
  const command = `sudo ./bin/demo -D 1 -m 35 ${filename} --led-rows=16 --led-chain=3`
  displayProcess = spawn(command.split(' ')[0], command.split(' ').slice(1));
}
