import Koa from 'koa';
import Router from 'koa-router';

const app = new Koa();
const router = new Router();

router.get('/auth-redirect', async function(ctx) {
  console.log('here!', ctx.req);
  //get the code

});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);
