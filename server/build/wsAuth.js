'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _auth = require('./auth');

var AuthUtils = _interopRequireWildcard(_auth);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WsAuth = function () {
  function WsAuth(wealthsimple) {
    _classCallCheck(this, WsAuth);

    this.wealthsimple = wealthsimple;
  }

  _createClass(WsAuth, [{
    key: 'update',
    value: async function update(wealthsimple) {
      this.wealthsimple = wealthsimple;
    }
  }, {
    key: 'get',
    value: async function get(path) {
      if (this.wealthsimple.auth) {
        try {
          //TODO: this should probably call AuthUtils.save_auth after each request (?)
          return this.wealthsimple.get(path);
        } catch (e) {
          console.error(e);
        }
      }
      return undefined;
    }
  }]);

  return WsAuth;
}();

exports.default = WsAuth;