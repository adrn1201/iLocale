const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

reviewSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Review', reviewSchema);