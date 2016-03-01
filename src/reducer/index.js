import {todos} from './todos';
import * as reduxDefault from 'gflux/build';

export var reducer = reduxDefault.default.combineReducers({todos});