'use strict';

var _index = require('./lib/index');

var _riotCompiler = require('riot/riot+compiler');

var riot = _interopRequireWildcard(_riotCompiler);

var _index2 = require('./selectors/index');

var _index3 = require('./reducer/index');

var _build = require('gflux/build');

var reduxDefault = _interopRequireWildcard(_build);

var _index4 = require('./actions/index');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var redux = reduxDefault.default;
var createStoreWithMiddleware = redux.applyMiddlewares(redux.middlewares.thunk)(redux.createStore);

window.domain = {
    actions: _index4.actions,
    selectors: _index2.selectors
};
window.riot = riot;

var store = createStoreWithMiddleware(_index3.reducer);
store.subscribe(function (state) {
    console.log(state);
});
riot.mount('*');
riot.mixin('redux', (0, _index.riotRedux)(store));