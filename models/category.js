const mongoose = require('mongoose');
const { Schema } = mongoose;
const Business = require('./business');

const categorySchema = new Schema({
    categoryName: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    businesses: [{
        type: Schema.Types.ObjectId,
        ref: 'Business'
    }]
}, { timestamps: true });

categorySchema.virtual('displayText').get(function() {
    return this.categoryName.charAt(0).toUpperCase() + this.categoryName.slice(1)
});

categorySchema.post('findOneAndDelete', async(doc) => {
    if (doc) {
        await Business.deleteMany({ _id: { $in: doc.businesses } })
    }
});

module.exports = mongoose.model('Category', categorySchema);