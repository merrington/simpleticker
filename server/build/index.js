'use strict';

var _auth = require('./auth');

var AuthUtils = _interopRequireWildcard(_auth);

var _webServer = require('./web-server');

var _webServer2 = _interopRequireDefault(_webServer);

var _wealthsimple = require('@wealthsimple/wealthsimple');

var _wealthsimple2 = _interopRequireDefault(_wealthsimple);

var _wsAuth = require('./wsAuth');

var _wsAuth2 = _interopRequireDefault(_wsAuth);

var _format = require('date-fns/format');

var _format2 = _interopRequireDefault(_format);

var _add_days = require('date-fns/add_days');

var _add_days2 = _interopRequireDefault(_add_days);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var wealthsimpleConfig = {
  env: 'sandbox',
  clientId: 'daa4bed9fce307551d2792cd86be6fadc82a814c4889aaa0c0c88ea972a74919',
  clientSecret: 'b865d3aa87525a430159c1dbdd71863bc67d95bcbc83c470c7c81573a5365cf8'
};

//try and load an existing auth
var authenticated = false;
var auth = AuthUtils.get_auth();
if (auth) {
  console.log('Loaded existing auth', auth);
  wealthsimpleConfig.auth = auth;
  authenticated = true;
}

//create a new Wealthsimple
var wealthsimple = new _wealthsimple2.default(wealthsimpleConfig);

async function updateAuth(auth) {
  AuthUtils.save_auth({ auth: auth });
  wealthsimpleConfig.auth = auth;
  wealthsimple = new _wealthsimple2.default(wealthsimpleConfig);
  await wsAuth.update(wealthsimple);

  authenticated = true;
  return authenticated;
}

var wsAuth = new _wsAuth2.default(wealthsimple);

// create the webserver - if auth gets update (user logs in) then call the `updateAuth` function
var webServer = new _webServer2.default(wealthsimple, updateAuth);

async function startPolling() {
  try {
    if (authenticated) {
      var clients = await wsAuth.get('/users');
      if (clients.results) {
        clients.results.forEach(async function (client) {
          var accounts = await wsAuth.get('/accounts');
          if (accounts.results) {
            accounts.results.forEach(async function (account) {
              var today_date = new Date();
              var today_formatted = (0, _format2.default)(today_date, 'YYYY-MM-DD');
              var yesterday_formatted = (0, _format2.default)((0, _add_days2.default)(today_date, -1), 'YYYY-MM-DD');

              console.log(yesterday_formatted, today_formatted);
              var query = '/daily_values?account_id=' + account.id + '&summary_date_start=' + yesterday_formatted + '&summary_date_end=' + today_formatted;
              console.log('sending query', query);
              var daily_values = await wsAuth.get(query);
              daily_values.results.forEach(console.log);
              //console.log('daily values', daily_values);
            });
          }
        });
      }
    }
  } catch (e) {
    console.error('error', e);
  }
}

setInterval(startPolling, 5000);

// user hits page -> login -> get code -> exchange for tokens