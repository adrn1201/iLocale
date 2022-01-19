const mongoose = require('mongoose');
const { Schema } = mongoose;
const Review = require('./review');

const imageSchema = new Schema({
    url: String,
    filename: String,
    originalName: String
});

imageSchema.virtual('carousel').get(function() {
    return this.url.replace('/upload', '/upload/w_1024,h_821,c_scale,e_improve,e_sharpen');
});

imageSchema.virtual('selection').get(function() {
    return this.url.replace('/upload', '/upload/w_450,h_450,c_scale,e_improve,e_sharpen');
});

const opts = { toJSON: { virtuals: true } };

const restaurantSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    images: [imageSchema],
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }
}, opts);

restaurantSchema.virtual('properties.popUpMarkup').get(function() {
    return `
        <strong><a href="/restaurants/${this._id}">${this.title}</a></strong>
        <p>${this.description.substring(0, 20)}...</p>`;
});

restaurantSchema.virtual('shortText').get(function() {
    return `${this.description.substring(0, 30)}...`
})

restaurantSchema.post('findOneAndDelete', async(doc) => {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        });
    }
});


module.exports = mongoose.model('Restaurant', restaurantSchema);