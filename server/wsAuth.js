import * as AuthUtils from './auth';

class WsAuth {
  constructor(wealthsimple) {
    this.wealthsimple = wealthsimple;
  }

  async update(wealthsimple) {
    this.wealthsimple = wealthsimple;
  }

  async get(path) {
    if (this.wealthsimple.auth) {
      try {
        //TODO: this should probably call AuthUtils.save_auth after each (?) request
        return this.wealthsimple.get(path);
      }
      catch (e) {
        console.error(e);
      }
    }
    return undefined;
  }
}

export default WsAuth;
