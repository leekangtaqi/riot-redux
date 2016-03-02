'use strict';

var _index = require('./lib/index');

var _riotCompiler = require('riot/riot+compiler');

var riot = _interopRequireWildcard(_riotCompiler);

var _index2 = require('./selectors/index');

var _index3 = require('./reducer/index');

var _build = require('gflux/build');

var reduxDefault = _interopRequireWildcard(_build);

var _index4 = require('./actions/index');

var _immutable = require('immutable');

var ImmutableDefault = _interopRequireWildcard(_immutable);

var _fetch = require('./lib/fetch');

var fetchAPI = _interopRequireWildcard(_fetch);

var _underscore = require('underscore');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var Immutable = ImmutableDefault.default;
var redux = reduxDefault.default;

var createStoreWithMiddleware = redux.applyMiddlewares(redux.middlewares.thunk)(redux.createStore);

window._ = _underscore._;
window.Immutable = Immutable;
window.riot = riot;
window.domain = Object.assign({
    actions: _index4.actions,
    selectors: _index2.selectors
}, fetchAPI);

console.log(domain);

var store = createStoreWithMiddleware(_index3.reducer);
store.subscribe(function (state) {
    console.log(state);
});
riot.mount('*');
riot.mixin('redux', (0, _index.riotRedux)(store));