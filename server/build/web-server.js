'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _auth = require('./auth');

var AuthUtils = _interopRequireWildcard(_auth);

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var app = new _koa2.default();
var router = new _koaRouter2.default();

var Webserver = function () {
  function Webserver(wealthsimple, updateAuth) {
    _classCallCheck(this, Webserver);

    this.wealthsimple = wealthsimple;
    this.updateAuth = updateAuth;

    this.startServer();
  }

  _createClass(Webserver, [{
    key: 'startServer',
    value: async function startServer() {
      var _this = this;

      var wealthsimple = this.wealthsimple;

      wealthsimple.get('/healthcheck').then(function (data) {
        return console.log('healthcheck good', data);
      }).catch(function (error) {
        return console.error('healthcheck bad', error);
      });

      router.get('/auth-redirect', async function (ctx) {
        var url = _url2.default.parse(ctx.req.url, true);
        var code = url.query.code;

        //TODO - what to do with this
        //make the request to get the new `auth` settings

        console.log({ code: code });
        var authPromise = wealthsimple.authenticate({
          grantType: 'authorization_code',
          redirect_uri: 'http://localhost:3000/auth-redirect',
          scope: 'read',
          state: '123',
          code: code
        });
        console.log({ authPromise: authPromise });
        var auth = await authPromise.then(function (newAuth) {
          console.log({ newAuth: newAuth });
          return _this.updateAuth(newAuth);
        }).catch(function (e) {
          console.log(e);
        });

        if (auth) {
          ctx.redirect('http://localhost:5000/main');
        }
      });

      app.use(router.routes());
      app.use(router.allowedMethods());

      app.listen(3000);
    }
  }]);

  return Webserver;
}();

;

exports.default = Webserver;