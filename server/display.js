const { spawn, exec } = require('child_process');
let displayProcess;

export function loading() {
  clearDisplay();
  const command = `sudo ./bin/led-image-viewer -D70 ws-loading.gif --led-rows=16 --led-chain=3`
  displayProcess = spawn(command.split(' ')[0], command.split(' ').slice(1));
}

export function clearDisplay() {
 const command = `sudo kill $(ps aux | grep 'server/bin' | awk '{print $2}')`;
 exec(command);
}

export function scroll(filename) {
  clearDisplay();
  const command = `sudo ./bin/demo -D 1 -m 35 ${filename} --led-rows=16 --led-chain=3`
  displayProcess = spawn(command.split(' ')[0], command.split(' ').slice(1));
}
