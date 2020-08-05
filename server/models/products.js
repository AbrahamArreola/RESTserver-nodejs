const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let Product = Schema({
    name: {type: String, required: [true, 'Name necessary']},
    price: {type: Number, required: [true, 'Price necessary']},
    description: {type: String, required: false},
    img: {type: String, required: false},
    available: {type: String, required: true, default: true},
    category: {type: Schema.Types.ObjectId, ref: 'Category'},
    user: {type: Schema.Types.ObjectId, ref: 'User'}
});

Product.plugin(uniqueValidator, {message: '{PATH} must be unique'});

module.exports = mongoose.model('Product', Product);