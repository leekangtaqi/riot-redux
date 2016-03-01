'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.todos = todos;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function todos() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? [{ text: '买烟' }, { text: '打酱油' }] : arguments[0];
    var action = arguments[1];

    switch (action.type) {
        case 'addTodos':
            return Object.assign([].concat(_toConsumableArray(state), [{ text: action.text }]));
        case 'loadAllTodos':
            return state;
        default:
            return state;
    }
}