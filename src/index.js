import {riotRedux} from './lib/index';
import * as riot from 'riot/riot+compiler';
import {selectors} from './selectors/index';
import {reducer} from './reducer/index';
import * as reduxDefault from 'gflux/build';
import {actions} from './actions/index';
import * as ImmutableDefault from 'immutable';
import * as fetchAPI from './lib/fetch';
import {_} from 'underscore';
import {spa} from './lib/spa';

var Immutable = ImmutableDefault.default;
var redux = reduxDefault.default;

window._ = _;
window.Immutable = Immutable;
window.riot = riot;
window.domain = Object.assign({
    actions,
    selectors
}, fetchAPI);

var createStoreWithMiddleware = redux.applyMiddlewares(redux.middlewares.thunk)(redux.createStore);
var store = createStoreWithMiddleware(reducer);
store.subscribe((state)=>{
    console.log(state)
});

spa.init();

riot.mount('*');
riot.mixin('redux', riotRedux(store));
riot.mixin('view', spa.viewify);
riot.mixin('addons', spa.addons);
riot.mixin('base', Object.assign({}, riotRedux(store), spa.addons, spa.viewify));

