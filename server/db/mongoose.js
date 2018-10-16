const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const db = process.env.PORT ? "mongodb://russellrussell:kUgAfRVvy9c5J2h@ds233763.mlab.com:33763/todo-app" : 'mongodb://localhost:27017/TodoApp';

mongoose.connect(db);

module.exports.mongoose = {mongoose}