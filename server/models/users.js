const mongoose = require('mongoose');

//Imports mongoose-unique-validator module which is able to validates database's duplicated data like emails or user names
const uniqueValidator = require('mongoose-unique-validator');

//Creates a Mongoose schema
let Schema = mongoose.Schema;

//Creates an enum to validate field's selectable options
let validRoles = {
    values: ['USER_ROLE', 'ADMIN_ROLE'],
    message: '{VALUE} is not a valid role'
};

//Creates the user schema with all its entities defining its data types and other configurations
let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name required']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email required']
    },
    password: {
        type: String,
        required: [true, 'Password required']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: "USER_ROLE",
        enum: validRoles
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

//Modifies the default message to specify the message which needs to be shown
userSchema.plugin(uniqueValidator, {message: '{PATH} must be unique'});

//Exports the model to be used in other modules
module.exports = mongoose.model('User', userSchema);