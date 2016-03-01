'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loadAllTodos = loadAllTodos;
exports.addTodos = addTodos;
function loadAllTodos() {
    return function (dispatch) {
        setTimeout(function () {
            dispatch({
                type: 'loadAllTodos'
            });
        }, 1000);
    };
}

function addTodos(text) {
    return {
        type: 'addTodos',
        text: text
    };
}