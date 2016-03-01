'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.riotRedux = riotRedux;
function riotRedux(store) {
    function init() {
        //根据selector初始化自己的,监听相应部分
    }

    function dispatch(action) {
        return store.dispatch(action);
    }

    function subscribe(selector, callback) {
        typeof callback != 'function' && (callback = this.update);

        var _version = 0;
        var hasRecomputations = !!selector.recomputations;

        function compute(state) {
            var currentState = selector(state);
            var version = hasRecomputations ? selector.recomputations() : _version + 1;
            if (version != _version) {
                _version = version;
                return callback(currentState);
            }
        }
        store.subscribe(function (state) {
            compute(state);
        });
    }

    return {
        init: init,
        dispatch: dispatch,
        subscribe: subscribe
    };
}