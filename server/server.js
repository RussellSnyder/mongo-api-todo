const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb')

const {mongoose} = require('./db/mongoose')
const {Todo} = require('./models/todo')
const {User} = require('./models/user')

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json())

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    })
    todo.save().then(doc => {
        res.send(doc);
    }, e => {
        res.status(404).send(e);
    })
})

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({
            todos
        })
    }, e => {
        res.status(400).send(e);
    })
})

app.get('/todos/:id', (req, res) => {
    let {id} = req.params;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send("id not valid");
    }

    Todo.findById(req.params.id).then((todo) => {
        if (!todo) {
            return res.status(400).send("no todo found")
        }
        res.send({todo})
    }, e => {
        res.status(400).send(e);
    })
})

if(!module.parent){
    app.listen(port, () => {
        console.log(`Started on port ${port}`)
    })
}

module.exports = {app}