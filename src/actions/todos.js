export function loadAllTodos(){
    return function(dispatch){
        setTimeout(()=>{
            dispatch({
                type: 'loadAllTodos'
            })
        }, 1000)
    };
}

export function addTodos(text){
    return {
        type: 'addTodos',
        text: text
    }
}