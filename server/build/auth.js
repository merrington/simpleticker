'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.save_auth = save_auth;
exports.get_auth = get_auth;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_AUTH_PATH = './data/auth.json';

function save_auth() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$auth = _ref.auth,
      auth = _ref$auth === undefined ? undefined : _ref$auth,
      _ref$file = _ref.file,
      file = _ref$file === undefined ? DEFAULT_AUTH_PATH : _ref$file;

  try {
    console.log('Saving auth', auth);
    _fs2.default.writeFileSync(file, JSON.stringify(auth));
  } catch (e) {
    console.error('Error saving auth', e);
  }
}

function get_auth() {
  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref2$file = _ref2.file,
      file = _ref2$file === undefined ? DEFAULT_AUTH_PATH : _ref2$file;

  try {
    var contents = _fs2.default.readFileSync(file);
    console.log('Loading auth', contents);
    return JSON.parse(contents);
  } catch (e) {
    return undefined;
  }
}