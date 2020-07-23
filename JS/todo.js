const addTodoForm = document.querySelector('.input');
const todoItemsDiv = document.querySelector('.todoItems');
let todoItemList = JSON.parse(localStorage.getItem('todos')) || [];
const buttons = document.querySelector('.buttons');
let allTodos = [];

window.onload = function(){
    if(todoItemList.length){
        todoItemList.forEach(todo=>{
            addTodoInHTML(todoItemsDiv,todo);
        }); 
    }
    else{
        todoItemsDiv.appendChild(createAlert('info',"no todo tasks to display"));
    }
}



function createAlert(alertType,msg){
    const div = document.createElement('div');
    div.className = `alert alert-${alertType}`;
    div.innerHTML =
    `
        ${msg}
    `
    return div;
}

addTodoForm.addEventListener('submit',addTodo);
todoItemsDiv.addEventListener('click',toggleCompleted);
todoItemsDiv.addEventListener('click',removeTodos);
buttons.addEventListener('click',manipulateTodos);

function manipulateTodos(e){
    switch(e.target.textContent){
        case "check all":
            checkAll();
            break;
        
        case "uncheck all":
            uncheckAll();
            break;
    
        case "delete all":
            todoItemList=[];
            localStorage.setItem('todos',JSON.stringify(todoItemList));
            updateList();
            insertAlert(createAlert('danger','All todo removed'));
            if(todoItemList.length===0){
                todoItemsDiv.appendChild(createAlert('info',"no todo tasks to display"));
            }
            break;
                    
    }
}

function checkAll(){
    todoItemsDiv.querySelectorAll('input').forEach(input=>{
        input.checked=true;
    });
    todoItemList.forEach(input=>{
        input.completed=true;
    });
    console.log(todoItemList);
    localStorage.setItem('todos',JSON.stringify(todoItemList));
}

function uncheckAll(){
    todoItemsDiv.querySelectorAll('input').forEach(input=>{
        input.checked=false;
    });
    todoItemList.forEach(input=>{
        input.completed=false;
    });
    localStorage.setItem('todos',JSON.stringify(todoItemList));
}

function removeTodos(e) {
    if(!e.target.classList.contains('todoItem'))return;
    allTodos = todoItemList.map(todo=>{
        return todo.todo;
    })
    todoItemList.splice(allTodos.indexOf(e.target.children[1].textContent),1);
    localStorage.setItem('todos',JSON.stringify(todoItemList));
    updateList();
    insertAlert(createAlert('danger','todo removed'));
    if(todoItemList.length===0){
        todoItemsDiv.appendChild(createAlert('info',"no todo tasks to display"));
    }
}

function updateList() {
    todoItemsDiv.innerHTML='';
    todoItemList.forEach(todo=>{
        const div = document.createElement('div');
        div.className = "todoItem";
        div.innerHTML =
        `
            <input type="checkbox" name="checkList" ${todo.completed ? "checked" : " "}>
            <p>${todo.todo}</p>
        `
        todoItemsDiv.appendChild(div);
    });
}

function toggleCompleted(e){
    if(!e.target.matches('input'))return;
    todoItemList.forEach(todo=>{
        if(e.target.nextElementSibling.textContent === todo.todo){
            todo.completed = !todo.completed;
        }
    });
    localStorage.setItem('todos',JSON.stringify(todoItemList));
}

function addTodo(e){
    e.preventDefault();
    const todo = (this.querySelector('[name=todoInput]').value);
    if(todo == ''){
        insertAlert(createAlert('warning','empty todo not allowed'));
        return;
    }
    if(!todoItemList.length>0)document.querySelector('.alert').remove();
    if(!isDuplicateTodo(todoItemList,todo)){
        todoItemList.push({todo,completed:false});
        localStorage.setItem('todos',JSON.stringify(todoItemList))
        addTodoInHTML(todoItemsDiv,{todo,completed:false});
        insertAlert(createAlert('success','todo added'));
    }else{
        insertAlert(createAlert('warning','this todo task already exists'));
    }
    this.reset();
}

function insertAlert(div){
    const innerDiv = document.querySelector('.innerDiv');
    const todoItems = document.querySelector('.todoItems');

    innerDiv.insertBefore(div,todoItems);

    setTimeout(removeAlert,1000);
}

function removeAlert(){
    document.querySelector('.alert').remove();
}

function isDuplicateTodo(todoItemList,Todo){
    allTodos = todoItemList.map(todo=>{
        return todo.todo;
    })
    
    return allTodos.some(todo=>{ 
        if(todo===Todo)return true
    });
}

function addTodoInHTML(todoItemsDiv,todo) {

    const div = document.createElement('div');
    div.className = "todoItem";
    div.innerHTML =
    `
        <input type="checkbox" name="checkList" ${todo.completed ? "checked" : " "}>
        <p>${todo.todo}</p>
    `
    todoItemsDiv.appendChild(div);
}