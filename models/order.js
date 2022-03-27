const mongoose = require('mongoose');
const { stringify } = require('uuid');
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
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
        orderLines: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'OrderLine',
            },
        ],
        totalPrice: {
            type: Number,
            required: true,
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model('Order', schema);