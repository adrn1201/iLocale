const mongoose = require('mongoose');
const { Schema } = mongoose;

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
    }
});

module.exports = mongoose.model('Restaurant', restaurantSchema);