const {MongoClient, ObjectID} = require("mongodb");

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log("Unable to conntect to MongoDB server")
    }

    const db = client.db('TodoApp');

    // db.collection('Todos')
    //     // .find({_id: new ObjectID("5bc4fdb0dccf5519103b5afc")})
    //     .find()
    //     .toArray()
    //     .then(docs => {
    //         console.log("todos");
    //         console.log(JSON.stringify(docs, undefined, 2))
    //     }, err => {
    //         console.log("unable to fetch todos", err)
    //     })

    // db.collection('Todos')
    //     // .find({_id: new ObjectID("5bc4fdb0dccf5519103b5afc")})
    //     .find()
    //     .count()
    //     .then(count => {
    //         console.log("Todos Count: " + count);
    //     }, err => {
    //         console.log("unable to fetch todos", err)
    //     })

    db.collection('Users')
        .find({name: "Russell"})
        // .find()
        .toArray()
        .then(docs => {
            console.log("Users");
            console.log(JSON.stringify(docs, undefined, 2))
        }, err => {
            console.log("unable to fetch todos", err)
        })

    client.close()
})