export function todos(state=[{text: '买烟'}, {text: '打酱油'}], action){
    switch (action.type){
        case 'addTodos':
            return Object.assign([...state, {text: action.text}]);
        case 'loadAllTodos':
            return state;
        default :
            return state
    }
}