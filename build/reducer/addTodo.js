'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.todos = todos;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function todos() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
    var action = arguments[1];

    console.log(action);
    switch (action.type) {
        case 'add':
            return Object.assign([].concat(_toConsumableArray(state), [action.payload]));
        default:
            return state;
    }
}