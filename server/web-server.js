import * as AuthUtils from './auth';
import Koa from 'koa';
import Router from 'koa-router';
import Url from 'url';

const app = new Koa();
const router = new Router();

class Webserver {
  constructor(wealthsimple, updateAuth) {
    this.wealthsimple = wealthsimple;
    this.updateAuth = updateAuth;

    this.startServer();
  }

  async startServer() {
    const wealthsimple = this.wealthsimple;

    wealthsimple.get('/healthcheck')
      .then(data => console.log('healthcheck good', data))
      .catch(error => console.error('healthcheck bad', error));

    router.get('/auth-redirect', async (ctx) => {
      const url = Url.parse(ctx.req.url, true);
      const code = url.query.code;

      //TODO - what to do with this
      //make the request to get the new `auth` settings

      console.log({code})
      const authPromise = wealthsimple.authenticate({
        grantType: 'authorization_code',
        redirect_uri: 'http://localhost:3000/auth-redirect',
        scope: 'read',
        state: '123',
        code: code
      });
      console.log({authPromise})
      const auth = await authPromise.then((newAuth) => {
        console.log({newAuth});
        return this.updateAuth(newAuth);
      }).catch((e) => { console.log(e) });

      if (auth) {
        ctx.redirect('http://localhost:5000/main');
      }
    });

    app.use(router.routes());
    app.use(router.allowedMethods());

    app.listen(3000);
  }
};

export default Webserver;
