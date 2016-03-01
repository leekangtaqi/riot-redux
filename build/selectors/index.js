'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.selectors = undefined;

var _reselect = require('reselect');

var addTodos = (0, _reselect.createSelector)(function (state) {
    return {
        value: state.value
    };
});

var loadAllTodos = (0, _reselect.createSelector)(function (state) {
    return state.todos;
}, function (todos) {
    return {
        todos: todos
    };
});

var selectors = exports.selectors = {
    addTodos: addTodos,
    loadAllTodos: loadAllTodos
};