import * as AuthUtils from './auth';
import Webserver from './webServer';
import Wealthsimple from '@wealthsimple/wealthsimple';
import WsAuth from './wsAuth';
import Ws from './getData';
import format from 'date-fns/format';
import addDays from 'date-fns/add_days';
import fs from 'fs';
import mkdirp from 'mkdirp';
import currencyFormatter from 'currency-formatter';

import generateImage from './generate-image';

import { clearDisplay, loading, scroll } from './display';

let loadingProcess = loading();

const wealthsimpleConfig = {
  env: 'sandbox',
  clientId: 'daa4bed9fce307551d2792cd86be6fadc82a814c4889aaa0c0c88ea972a74919',
  clientSecret: 'b865d3aa87525a430159c1dbdd71863bc67d95bcbc83c470c7c81573a5365cf8'
};

const COLORS = {
  YELLOW: 0xFFFF33FF,
  RED:    0xFF0000FF,
  GREEN:  0x00FF00FF,
  WHITE:  0xFFFFFFFF,
  BLUE:   0x0000FFFF
};

mkdirp('./data');

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

async function clearAuth() {
  AuthUtils.clear_auth();
  wealthsimple = new Wealthsimple(wealthsimpleConfig);
  await wsAuth.update(wealthsimple);

  authenticated = false;
  return authenticated;
}

const wsAuth = new WsAuth(wealthsimple);

// create the webserver - if auth gets update (user logs in) then call the `updateAuth` function
const webServer = new Webserver(wealthsimple, updateAuth, clearAuth);
const ws = new Ws(wsAuth);

function formatCurrency(amount) {
  return currencyFormatter.format(parseFloat(amount.amount), { code: amount.currency });
}

async function startPolling() {
  try {
    if (authenticated) {
      //await ws.updateName(); // Call this if you want the name changed, update it in `getData.js`
      const client = await ws.getPeople();
      const clientName = getClientName(client);
      const clientGreeting = getClientGreeting(clientName);
      const accounts = await ws.getAccounts();

      if (accounts) {
        let finalStrings = accounts.map(async (account) => {
          const today = new Date();
          const today_formatted = format(getLastBusinessDay(today, 0));
          const yesterday_formatted = format(getLastBusinessDay(today, 1));

          const daily_values = await ws.getDailyValues(account, yesterday_formatted, today_formatted);

          const yesterday_positions = await ws.getPositions(account, yesterday_formatted);
          const today_positions = await ws.getPositions(account, today_formatted);

          //build the strings
          const aggregated_positions = buildAccountResult(account, [...today_positions, ...yesterday_positions]);

          let accountStrings = [{ text: `${getAccountName(account)} `, font: '7x14B', color: COLORS.YELLOW }];
          accountStrings.push({ text: `${formatCurrency(account.gross_position)} `, font: '7x14B', color: COLORS.WHITE  });
          for (let symbol in aggregated_positions) {
            const byHowMuch = (aggregated_positions[symbol].values[0].value.amount - aggregated_positions[symbol].values[1].value.amount).toFixed(2);
            let changeSymbol;
            let color;
            if (byHowMuch > 0) {
              changeSymbol = '▲';
              color = COLORS.GREEN;
            } else if (byHowMuch < 0) {
              changeSymbol = '▼';
              color = COLORS.RED;
            } else {
              changeSymbol = '▶'; // No change
              color = COLORS.YELLOW;
            }
            const isUp = byHowMuch >= 0;
            const byHowMuchAmount = { amount: Math.abs(byHowMuch), currency: aggregated_positions[symbol].values[0].value.currency };
            accountStrings.push({ text: `${symbol} ${changeSymbol} ${formatCurrency(byHowMuchAmount)}  `, font: '7x14', color });
          }
          return accountStrings;
        });
        finalStrings = (await Promise.all(finalStrings)).flatten();
        finalStrings.unshift([
          { text: '           ', font: '7x14', color: COLORS.WHITE },
          { text: clientGreeting, font: '7x14B', color: COLORS.BLUE }
        ]);
        finalStrings = finalStrings.flatten();
        console.log(finalStrings);

        generateImage(finalStrings)
          .then(imagePath => {
            clearDisplay(loadingProcess);
            scroll(imagePath);
          });
      }
    }
  }
  catch (e) {
    console.error('error', e)
  }
}

function getLastBusinessDay(now, daysOffset = 0) {
  let today;
  if (now.getDay() == 0) {
    today = new Date(now);
    today.setDate(today.getDate() - 2);
  } else if (now.getDay() == 6) {
    today = new Date(now);
    today.setDate(today.getDate() - 1);
  } else {
    today = new Date(now);
  }

  if (daysOffset > 0) {
    let dayInPast = new Date(today);
    dayInPast.setDate(dayInPast.getDate() - daysOffset);
    return getLastBusinessDay(dayInPast, daysOffset - 1);
  } else {
    return today;
  }
}

function getAccountName(account) {
  if (account.nickname && account.nickname.length) {
    return account.nickname;
  }

  switch(account.type) {
    case 'tfsa':
      return 'TFSA';
    case 'rrsp':
      return 'RRSP';
    case 'ca_hisa':
      return 'HISA';
    case 'gb_jisa':
      return 'JISA';
    case 'gb_isa':
     return 'ISA';
    case 'gb_individual':
      return 'Personal';
    default:
      return account.type;
  }
}

function getClientName(client) {
  client = client[0];
  const first = client.preferred_first_name;
  const last = client.full_legal_name.last_name;
  return `${first} ${last}`;
}

function getClientGreeting(name) {
  const hour = (new Date()).getHours() - 4; // - 4 to EST
  let greeting;
  if (hour < 12)
    greeting = `Good morning`;
  else if (hour < 17)
    greeting = `Good afternoon`;
  else
    greeting = `Good evening`;

  return `${greeting}, ${name}`;
}

(function pollForAuth() {
  if (!fs.existsSync('./data/auth.json')) {
    setTimeout(pollForAuth, 1000);
  } else {
    startPolling();
    //setInterval(startPolling, 50 * 1000);
  }
})();


// user hits page -> login -> get code -> exchange for tokens

function sortFunc(a, b) {
  if (a < b) { return -1; }
  if (a > b) { return 1; }
  return  0;
}

function buildAccountResult(account, positions) {
  return positions.reduce((acc, position) => {
    const data = {
      date: position.position_date,
      value: position.account_value
    };
    if (!acc[position.asset.symbol]) {
      acc[position.asset.symbol] = { values: [] };
    }
    acc[position.asset.symbol].values.push(data);
    // Sort by date
    acc[position.asset.symbol].values.sort(sortFunc);

    return acc;
  }, {});
}
