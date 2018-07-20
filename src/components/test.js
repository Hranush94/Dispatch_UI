import React from 'react';
function TodoList ({todos,children}){
    return (
        <section className="main-section">
            <ul className="todo-list">
                {
                    todos.map((todo,i)=>{
                        <li key={i}>
                            {children(todo)}
                        </li>
                    })
                }
            </ul>
        </section>

    )
}

function App(){
    const todos=[
        {label:'Write tests',status:'done'},
        {label:'Sent Report',status:'progress'},
        {label:'Answer emails',status:'done'},
    ];
    const isCompleted=todo=>todo.status==='done';
    return(
        <TodoList todos={todos}>
            {
                todo=>isCompleted(todo)?<b>
                    {todo.label}
                </b>:todo.label
            }
        </TodoList>

    )
}
export default App;