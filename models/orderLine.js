const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model('OrderLine', schema);