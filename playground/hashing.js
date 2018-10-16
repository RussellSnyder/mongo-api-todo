const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')

var password = '123abc!';

// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//         console.log(hash)
//     })
// })

var hashedPassword = '$2a$10$Wp6xL5JOYhssuy87VPPT1uxdx9GdpbpqkPKszJ2xsj7/2hvYz4JKy';

bcrypt.compare(password, hashedPassword ,(err, res) => {
    console.log(res)
})


// var data = {
//     id: 10
// }
//
// var token = jwt.sign(data, '123abc')
// console.log(token)
//
// token+= 'yo';
// var decoded = jwt.verify(token, '123abc')
// console.log(decoded)
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