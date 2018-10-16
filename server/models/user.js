const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');
const jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
        email: {
            type: String,
            required: true,
            minLength: 1,
            trim: true,
            unique: true,
            validate: {
                validator: validator.isEmail,
                message: `{Value} is not a valid email`
            }
        },
        password: {
            type: String,
            require: true,
            minlength: 6
        },
        tokens: [{
            access: {
                type: String,
                required: true
            },
            token: {
                type: String,
                required: true
            }
        }]
    }
)

UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject()

    return _.pick(userObject, ['_id', 'email'])
}
UserSchema.methods.generateAuthToken = function () {
    var user = this;
    let access = 'auth';
    let token = jwt.sign({_id: user._id.toHexString(), access: access}, 'abc123').toString()

    user.tokens = user.tokens.concat([{token,access}])

    return user.save().then(() => {
        return token;
    })
}

var User = mongoose.model('User', UserSchema)

module.exports = {User}