const mongoose = require('mongoose');
const { Schema } = mongoose;
const Business = require('./business');
const mongoosePaginate = require('mongoose-paginate-v2');

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

categorySchema.virtual('iconClass').get(function() {
    let icon = ''
    if (this.categoryName === 'restaurant') {
        icon = 'cutlery'
    } else if (this.categoryName === 'hotel') {
        icon = 'bed'
    } else if (this.categoryName === 'fitness') {
        icon = 'grav'
    } else if (this.categoryName === 'car') {
        icon = 'coffee'
    }
    return `${icon}`
});

categorySchema.post('findOneAndDelete', async(doc) => {
    if (doc) {
        await Business.deleteMany({ _id: { $in: doc.businesses } })
    }
});

categorySchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Category', categorySchema);