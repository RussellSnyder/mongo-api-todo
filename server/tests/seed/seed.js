const {ObjectID} = require('mongodb')
const jwt = require('jsonwebtoken');

const {Todo} = require('../../models/todo')
const {User} = require('../../models/user')


const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [
    {
        _id: userOneId,
        email: "andrew@example.com",
        password: "userOnePass",
        tokens: [
            {
                access: 'auth',
                token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
            }
        ]
    },
    {
        _id: userTwoId,
        email: "another@example.com",
        password: "userTwoPass",
        tokens: [
            {
                access: 'auth',
                token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
            }
        ]

    },
]

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo',
    _creator: userOneId
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333,
    _creator: userTwoId
}];

const populateTodos = (done) => {
    Todo.insertMany(todos).then(res => done())
}

const deleteTodos = (done) => {
    Todo.deleteMany({}).then(res => done())
}

const populateUsers = (done) => {
        var user1 = new User(users[0]).save();
        var user2 = new User(users[1]).save();

        Promise.all([user1, user2]).then(() => done())
}

const deleteUsers = (done) => {
    User.deleteMany({}).then(() => done())
}

module.exports = {populateTodos, deleteTodos, todos, populateUsers, deleteUsers, users}