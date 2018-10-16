const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
console.log(JSON.stringify(process.env, undefined, 2));
const db = process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp';

mongoose.connect(db);

module.exports.mongoose = {mongoose}