const {MongoClient, ObjectID} = require("mongodb");

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log("Unable to conntect to MongoDB server")
    }
    console.log("connected to MongoDB server")
    const db = client.db('TodoApp');

    db.collection('Todos').insertOne({
        test: "Something todo",
        completed: false
    }, (err, result) => {
        if (err) {
            return console.log("unable to insert Todo", err)
        }

        console.log(JSON.stringify(result.ops, undefined, 2))
    })

    db.collection('Users').insertOne({
        name: "Russell",
        age: 30,
        location: "Maryland"
    }, (err, result) => {
        if (err) {
            return console.log("unable to Add User", err)
        }

        console.log(JSON.stringify(result.ops, undefined, 2))
    })

    client.close()
})