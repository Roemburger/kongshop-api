const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    street: {
        type: String,
    },
    number: {
        type: String,
    },
    postalCode: {
        type: String,
    },
    city: {
        type: String,
    },
    region: {
        type: String,
    },
    country: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    orders: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Order',
        },
    ],
});

module.exports = mongoose.model('User', schema);