const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categorySchema = new Schema({
    description: {
        type: String,
        required: [true, 'Description required'],
        unique: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

categorySchema.plugin(uniqueValidator, {message: '{PATH} must be unique'});

module.exports = mongoose.model('Category', categorySchema);