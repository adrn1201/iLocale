const mongoose = require('mongoose');
const { Schema } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    googleId: String,
    username: {
        type: String,
        required: true,
        unique: true
    },
    isSuperUser: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('User', userSchema);