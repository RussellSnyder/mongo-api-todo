const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/todo')

var id = '5bc5e372a3a63b3148a980d2';

Todo.find({
    _id: id
}).then(todos => {
    if (todos.length == 0) return console.log("todos not found")
    console.log("Todos: ", todos)
})

Todo.findOne({
    _id: id
}).then(todo => {
    if (!todo) return console.log("todo not found")
    console.log("Todos: ", todo)
})

Todo.findById(id).then(todo => {
    if (!todo) return console.log("todoById fail")
    console.log("Todo by id: ", todo)
})

