const mongoose = require('mongoose');
const { Schema } = mongoose;
const Restaurant = require('./restaurant');

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

categorySchema.virtual('displayText').get(function() {
    return this.categoryName.charAt(0).toUpperCase() + this.categoryName.slice(1)
});

categorySchema.post('findOneAndDelete', async(doc) => {
    if (doc) {
        await Restaurant.deleteMany({ _id: { $in: doc.restaurants } })
    }
});

module.exports = mongoose.model('Category', categorySchema);