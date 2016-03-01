import {createSelector} from 'reselect';

var addTodos  = createSelector((state)=>{
    return {
        value: state.value
    }
});

var loadAllTodos  = createSelector(
    state=>state.todos,
    (todos) => {
        return {
            todos: todos
        }
    }
);

export var selectors = {
    addTodos,
    loadAllTodos
};