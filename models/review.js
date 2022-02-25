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
}, { timestamps: true });

reviewSchema.virtual('displayDate').get(function() {
    return this.createdAt.split('GMT')[1];
});

reviewSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Review', reviewSchema);