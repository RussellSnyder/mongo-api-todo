const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const db = process.env.PROD_MONGODB || 'mongodb://localhost:27017/TodoApp';

mongoose.connect(db);

module.exports.mongoose = {mongoose}