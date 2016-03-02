import {riotRedux} from './lib/index';
import * as riot from 'riot/riot+compiler';
import {selectors} from './selectors/index';
import {reducer} from './reducer/index';
import * as reduxDefault from 'gflux/build';
import {actions} from './actions/index';
import * as ImmutableDefault from 'immutable';
import * as fetchAPI from './lib/fetch';
import {_} from 'underscore';

var Immutable = ImmutableDefault.default;
var redux = reduxDefault.default;

var createStoreWithMiddleware = redux.applyMiddlewares(redux.middlewares.thunk)(redux.createStore);

window._ = _;
window.Immutable = Immutable;
window.riot = riot;
window.domain = Object.assign({
    actions,
    selectors
}, fetchAPI);

console.log(domain)

var store = createStoreWithMiddleware(reducer);
store.subscribe((state)=>{
    console.log(state)
});
riot.mount('*');
riot.mixin('redux', riotRedux(store));

