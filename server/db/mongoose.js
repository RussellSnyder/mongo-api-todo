const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const db = process.env.MONGODB_URI;

mongoose.connect(db);

module.exports.mongoose = {mongoose}