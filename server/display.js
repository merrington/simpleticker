const { spawn } = require('child_process');
let displayProcess;

export function loading() {
  displayProcess = spawn('sudo ./bin/led-image-viewer -D70 ws-loading.gif --led-rows=16 --led-chain=3');
}

export function stopDisplay() {
  displayProcess.kill();
}

export function scroll(filename) {
  displayProcess = spawn(`sudo ./bin/demo -D 1 -m 35 ${filename} --led-rows=16 --led-chain=3`);
}
