import * as AuthUtils from './auth';
import Webserver from './web-server';
import Wealthsimple from '@wealthsimple/wealthsimple';
import WsAuth from './wsAuth';
import format from 'date-fns/format';
import addDays from 'date-fns/add_days';

const wealthsimpleConfig = {
  env: 'sandbox',
  clientId: 'daa4bed9fce307551d2792cd86be6fadc82a814c4889aaa0c0c88ea972a74919',
  clientSecret: 'b865d3aa87525a430159c1dbdd71863bc67d95bcbc83c470c7c81573a5365cf8'
};

//try and load an existing auth
let authenticated = false;
const auth = AuthUtils.get_auth();
if (auth) {
  console.log('Loaded existing auth', auth);
  wealthsimpleConfig.auth = auth;
  authenticated = true;
}

//create a new Wealthsimple
let wealthsimple = new Wealthsimple(wealthsimpleConfig);

async function updateAuth(auth) {
  AuthUtils.save_auth({auth});
  wealthsimpleConfig.auth = auth;
  wealthsimple = new Wealthsimple(wealthsimpleConfig);
  await wsAuth.update(wealthsimple);

  authenticated = true;
  return authenticated;
}

const wsAuth = new WsAuth(wealthsimple);

// create the webserver - if auth gets update (user logs in) then call the `updateAuth` function
const webServer = new Webserver(wealthsimple, updateAuth);

async function startPolling() {
  try {
    if (authenticated) {
      const clients = await wsAuth.get(`/users`);
      if (clients.results) {
        clients.results.forEach(async (client) => {
          const accounts = await wsAuth.get('/accounts');
          if (accounts.results) {
            accounts.results.forEach(async (account) => {
              const today_date = new Date();
              const today_formatted = format(today_date, 'YYYY-MM-DD');
              const yesterday_formatted = format(addDays(today_date, -1), 'YYYY-MM-DD');

              console.log(yesterday_formatted, today_formatted);
              const query = `/daily_values?account_id=${account.id}&summary_date_start=${yesterday_formatted}&summary_date_end=${today_formatted}`;
              console.log('sending query', query);
              const daily_values = await wsAuth.get(query);
              daily_values.results.forEach(console.log);
              //console.log('daily values', daily_values);
            });
          }
        });
      }
    }
  }
  catch (e) {
    console.error('error', e)
  }
}

setInterval(startPolling, 5000);


// user hits page -> login -> get code -> exchange for tokens
