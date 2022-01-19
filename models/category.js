const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorySchema = new Schema({
    categoryName: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    restaurants: [{
        type: Schema.Types.ObjectId,
        ref: 'Restaurant'
    }]
});

module.exports = mongoose.model('Category', categorySchema);