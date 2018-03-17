const { spawn } = require('child_process');
let displayProcess;

export function loading() {
  const command = `sudo ./bin/led-image-viewer -D70 ws-loading.gif --led-rows=16 --led-chain=3`
  displayProcess = spawn(command.split(' ')[0], command.split(' ').slice(1));
}

export function stopDisplay() {
  displayProcess.kill();
}

export function scroll(filename) {
  const command = `sudo ./bin/demo -D 1 -m 35 ${filename} --led-rows=16 --led-chain=3`
  displayProcess = spawn(command.split(' ')[0], command.split(' ').slice(1));
}
