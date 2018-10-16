const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb')

const {app} = require("./../server")
const {Todo} = require("../models/todo")

request.agent(app.listen());

const todos = [
    {_id: new ObjectID(), text: 'First todo'},
    {_id: new ObjectID(), text: 'second todo'}
]

beforeEach((done) => {
    Todo.deleteMany({}).then(() => {
        return Todo.insertMany(todos)
    }).then(() => done())
})


describe("Post /todos", () => {
    it('should create a new todo', done => {
        var text = "yolo";

        request(app)
            .post("/todos")
            .send({text: text})
            .expect(200)
            .expect(res => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done()
                }).catch(e => done(e))
            })
    })

    it('should not create a todo with invalid body', done => {
        var text = "";

        request(app)
            .post("/todos")
            .send({text: text})
            .expect(404)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done()
                }).catch(e => done(e))
            })
    })
})

describe('GET /todos', () => {
    it('should get all todos', done => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect(res => {
                expect(res.body.todos.length).toBe(2)
            })
            .end(() => {
                done()
            })
    })
})

describe('GET /todos/:id', () => {
    it('should return todo doc for a given id', done => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            // .expect(200)
            .expect((res) => {
                let {todo} = res.body;
                expect(todo.text).toBe(todos[0].text)
            })
            .end(done)
    })
    it('should return 400 if todo is not found', done => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .expect(400)
            .end(done)
    })
    it('should return 404 if id is invalid', done => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString() + 'fosho'}`)
            .expect(404)
            .end(done)
    })
})

describe('DELETE /todos/:id', () => {
    it('should remove a todo for a given id', done => {
        request(app)
            .delete(`/todos/${todos[1]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                let {todo} = res.body;
                expect(todo._id).toBe(todos[1]._id.toHexString())
            })
            .end((err, res) => {
                if (err) return done(err)

                Todo.findById(todos[1]._id.toHexString()).then(todo => {
                    expect(todo).toBeNull();
                    done()
                }).catch(e => done(e))
            })
    })
    it('should return 400 if todo is not found', done => {
        request(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .expect(400)
            .end(done)
    })
    it('should return 404 if id is invalid', done => {
        request(app)
            .delete(`/todos/${new ObjectID().toHexString() + 'fosho'}`)
            .expect(404)
            .end(done)
    })
})

