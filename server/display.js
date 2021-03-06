const { spawn } = require('child_process');

let displayProcess;

export function loading() {
  const args = ['-C', '-D70', '3-dots.gif', '--led-rows=16', '--led-chain=3', '--led-slowdown-gpio=1'];
  console.log('Spawn loading screen');
  return spawn('./bin/led-image-viewer', args);
}

export function clearDisplay(process) {
  console.log('about to kill a process');
  process.kill()
  console.log('killed');
}

export function scroll(filename) {
  const args =['-D', '1', '-m', '35', filename, '--led-rows=16', '--led-chain=3', '--led-slowdown-gpio=1'];
  console.log('Spawn demo', filename);
  return spawn('./bin/demo', args);
}
