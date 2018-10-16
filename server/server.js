require('./config/config')

const _ = require("lodash")
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb')

const {mongoose} = require('./db/mongoose')
const {Todo} = require('./models/todo')
const {User} = require('./models/user')
const {authenticate} = require('./middleware/authenticate')

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
    }).catch(e => res.status(400).send(e))
})

app.patch('/todos/:id', (req, res) => {
    let {id} = req.params;
    // only properties a user can update
    var body = _.pick(req.body, ['text', 'completed'])

    if (!ObjectID.isValid(id)) {
        return res.status(404).send("id not valid");
    }

    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        body.completedAt = body.completed ? new Date().getTime() : null;
    }

    Todo.findOneAndUpdate({_id: new ObjectID(id)}, {$set: body}, {new: true})
    .then(todo => {
        if (!todo) {
            return res.status(400).send(e);
        }
        res.send({todo})
    }).catch(e => {
        res.status(400).send(e);
    })
})

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({
            todos
        })
    }, e => {
        res.status(400).send(e);
    }).catch(e => res.status(400).send(e))
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
    }).catch(e => res.status(400).send(e))
})

app.delete('/todos/:id', (req, res) => {
    let {id} = req.params;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send("id to delete not valid");
    }

    Todo.findByIdAndRemove(req.params.id).then((todo) => {
        if (!todo) {
            return res.status(400).send("no todo found to delete")
        }
        res.send({todo})
    }, e => {
        res.status(400).send(e);
    }).catch(e => res.status(400).send(e))
})


// USERS
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password'])

    var user = new User(body)

    user.save()
        .then(() => {
            return user.generateAuthToken()
        // res.send(user);
        }).then(token => {
            res.header('x-auth', token).send(user)
        }).catch(e => res.status(400).send(e))
})


app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user)
})



if(!module.parent){
    app.listen(port, () => {
        console.log(`Started on port ${port}`)
    })
}

module.exports = {app}