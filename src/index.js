import {riotRedux} from './lib/index';
import * as riot from 'riot/riot+compiler';
import {selectors} from './selectors/index';
import {reducer} from './reducer/index';
import * as reduxDefault from 'gflux/build';
import {actions} from './actions/index';

var redux = reduxDefault.default;
var createStoreWithMiddleware = redux.applyMiddlewares(redux.middlewares.thunk)(redux.createStore);

window.domain = {
    actions,
    selectors
};
window.riot = riot;

var store = createStoreWithMiddleware(reducer);
store.subscribe((state)=>{
    console.log(state)
});
riot.mount('*');
riot.mixin('redux', riotRedux(store));

