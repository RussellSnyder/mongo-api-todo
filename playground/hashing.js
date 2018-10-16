const {SHA256} = require('crypto-js');

const jwt = require('jsonwebtoken');

var data = {
    id: 10
}

var token = jwt.sign(data, '123abc')
console.log(token)

token+= 'yo';
var decoded = jwt.verify(token, '123abc')
console.log(decoded)
// var message = "I am user number 3";
//
// var hash = SHA256(message).toString();
//
// console.log(message)
// console.log(hash)
//
// var data = {
//     id: 'jojo'
// }
//
// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString()
//
// if (resultHash === token.hash) {
//     console.log('data was not changed')
// } else {
//     console.log('data was changed, DONT TRUST!')
// }