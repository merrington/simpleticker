import * as AuthUtils from './auth';
import cors from 'kcors';
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

    router.post('/auth', async (ctx) => {
      const url = Url.parse(ctx.req.url, true);
      const code = url.query.code;

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
        ctx.status = 200;
      }
      else {
        ctx.status = 400;
      }
    });

    app.use(cors());
    app.use(router.routes());
    app.use(router.allowedMethods());

    app.listen(5000);
  }
};

export default Webserver;
