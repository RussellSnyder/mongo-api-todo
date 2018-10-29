const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb')

const {app} = require("./../server")
const {Todo} = require("../models/todo")
const {User} = require("../models/user")
const {todos, populateTodos, deleteTodos, users, populateUsers, deleteUsers} = require("./seed/seed")

request.agent(app.listen());

beforeEach(populateTodos);
beforeEach(populateUsers);
afterEach(deleteTodos);
afterEach(deleteUsers);



describe("Post /todos", () => {
    it('should create a new todo', done => {
        var text = 'Test todo text';
        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    })

    it('should not create a todo with invalid body', done => {
        var text = "";

        request(app)
            .post("/todos")
            .send({text: text})
            .set('x-auth', users[0].tokens[0].token)
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
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body.todos.length).toBe(1)
            })
            .end(() => {
                done()
            })
    })
})

describe('GET /todos/:id', () => {
    it('should return todo doc', done => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                let {todo} = res.body;
                expect(todo.text).toBe(todos[0].text)
            })
            .end(done)
    })

    it('should not return a todo doc created by another user', done => {
        request(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(400)
            .end(done)
    })
    it('should return 400 if todo is not found', done => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(400)
            .end(done)
    })
    it('should return 404 if id is invalid', done => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString() + 'fosho'}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done)
    })
})

describe('DELETE /todos/:id', () => {
    it('should remove a todo for a given id', done => {
        request(app)
            .delete(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth', users[1].tokens[0].token)
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
            .set('x-auth', users[1].tokens[0].token)
            .expect(400)
            .end(done)
    })
    it('should return 404 if id is invalid', done => {
        request(app)
            .delete(`/todos/${new ObjectID().toHexString() + 'fosho'}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done)
    })
})

describe('PATCH /todos/:id', () => {
    it('should update the todo', done => {
        var hexID = todos[0]._id.toHexString();
        var newText = "I am the new text"

        request(app)
            .patch(`/todos/${hexID}`)
            .set('x-auth', users[0].tokens[0].token)
            .send({
                completed: true,
                text: newText
            })
            .expect(200)
            .expect((res) => {
                let {text, completed, completedAt} = res.body.todo;
                expect(text).toBe(newText)
                expect(completed).toBe(true)
                expect(typeof completedAt).toBe('number');
            })
            .end((err, res) => {
                if (err) return done(err)
                done()
            })
    })
    it('should not update the todo if it does not belong to user', done => {
        var hexID = todos[0]._id.toHexString();
        var newText = "I am the new text"

        request(app)
            .patch(`/todos/${hexID}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({
                completed: true,
                text: newText
            })
            .expect(400)
            .end((err, res) => {
                if (err) return done(err)
                done()
            })
    })
    it('should clear completedAt if complete is set to false', done => {
        var hexID = todos[0]._id.toHexString();

        request(app)
            .patch(`/todos/${hexID}`)
            .set('x-auth', users[0].tokens[0].token)
            .send({
                completed: false,
            })
            .expect(200)
            .expect((res) => {
                let {text, completed, completedAt} = res.body.todo;
                expect(text).toBe(todos[0].text)
                expect(completed).toBe(false)
                expect(completedAt).toBeFalsy();
            })
            .end((err, res) => {
                if (err) return done(err)
                done()
            })
    })
})

describe('GET /users/me', () => {
    it('should return user is authenticated', done => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body._id).toBe(users[0]._id.toHexString())
                expect(res.body.email).toBe(users[0].email)
            })
            .end(done)
    })

    it('should return 401 if not authenticated', done => {
        request(app)
            .get('/user/me')
            .expect(401)
            .end(() => {
                done()
            })
    })
})

describe("POST /users", () => {
    it('should create a user', done => {
        let email = 'test@tester.com';
        let password = '123abc!';
        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect(res => {
                expect(res.headers['x-auth']).toBeTruthy()
                expect(res.body._id).toBeTruthy()
                expect(res.body.email).toBe(email)
            })
            .end(err => {
                if (err) {
                    return done(err)
                }

                User.findOne({email}).then(user => {
                    expect(user).toBeTruthy();
                    expect(user.password === password).toBeFalsy();
                    done();
                }).catch(e => done(e))
            });
    })

    it('should return validation errors if request is invalid', done => {
        request(app)
            .post('/users')
            .send({email: 'yolo', password: 'w'})
            .expect(400)
            .end(done);
    })

    it('should not create user if email is in use', done => {
        let email = 'test@tester.com';
        let password = '123abc!';
        request(app)
            .post('/users')
            .send({email, password})
            .end(() => {
                request(app)
                    .post('/users')
                    .send({email, password})
                    .expect(400)
                    .end(done);
            })
    })
})

describe("POST /users/login", () => {
    it('should login user and return auth token', done => {
        let {email, password, _id} = users[0];
        request(app)
            .post('/users/login')
            .send({email, password})
            .expect(200)
            .expect(res => {
                expect(res.header['x-auth']).toBeTruthy()
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                User.findById(_id).then(user => {
                    expect(user.tokens[1].access).toBe('auth');
                    done()
                }).catch(e => done(e))
            })
    })
    it('should reject invalid login', done => {
        let {email, id} = users[0];
        let {password} = users[1];
        request(app)
            .post('/users/login')
            .send({email, password})
            .expect(400)
            .end(done)
    })
})

describe("DELETE /users/me/token", () => {
    let token = users[0].tokens[0].token

    it("should remove auth token on logout", done => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', token)
            .send()
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                User.findById(users[0]._id).then(user => {
                    expect(user.tokens.length).toBe(0)
                    done()
                }).catch(err => done(err))
            })

    })
})