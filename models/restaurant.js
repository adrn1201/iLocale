const mongoose = require('mongoose');
const { Schema } = mongoose;
const Review = require('./review');

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
    images: {
        type: String
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

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