import fs from 'fs';

const DEFAULT_AUTH_PATH = './data/auth.json';

export function save_auth({ auth = undefined, file = DEFAULT_AUTH_PATH } = {}) {
  try {
    fs.writeFileSync(file, JSON.stringify(auth));
  }
  catch (e) {
    console.error('Error saving auth', e);
  }
}

export function get_auth({ file = DEFAULT_AUTH_PATH } = {}) {
  try {
    const contents = fs.readFileSync(file);
    return JSON.parse(contents);
  }
  catch (e) {
    return undefined;
  }
}
