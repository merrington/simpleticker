import Koa from 'koa';
import Router from 'koa-router';
import Url from 'url';
import Wealthsimple from '@wealthsimple/wealthsimple';
import * as AuthUtils from './auth';

import generateImage from './generate-image';

generateImage("Hi, I'm ABE");

const app = new Koa();
const router = new Router();

const wealthsimpleConfig = {
  env: 'sandbox',
  clientId: 'daa4bed9fce307551d2792cd86be6fadc82a814c4889aaa0c0c88ea972a74919',
  clientSecret: 'b865d3aa87525a430159c1dbdd71863bc67d95bcbc83c470c7c81573a5365cf8'
};

const auth = AuthUtils.get_auth();
if (auth) {
  wealthsimpleConfig.auth = auth;
  //TODO - Go run some other code if we already have an auth...
}

const wealthsimple = new Wealthsimple(wealthsimpleConfig);

wealthsimple.get('/healthcheck')
  .then(data => console.log('healthcheck good', data))
  .catch(error => console.error('healthcheck bad', error));

router.get('/auth-redirect', async function(ctx) {
  console.log('here');
  const url = Url.parse(ctx.req.url, true);
  const code = url.query.code;

  //TODO - handle requests with `error` query parameter

  //make the auth request
  console.log('got the code', code);
  const authPromise = wealthsimple.authenticate({
    grantType: 'authorization_code',
    redirect_uri: 'http://localhost:3000/auth-redirect',
    state: '123',
    scope: 'read',
    code: code
  });

  const auth = await authPromise
        .catch(error => console.error('Problem with auth', error));

  //TODO - these details should be persisted after each request...?
  console.log(auth);
  AuthUtils.save_auth({ auth });

  if (auth) {
    ctx.redirect('http://localhost:5000/main');
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);
