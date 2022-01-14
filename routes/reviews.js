const express = require('express');
const router = express.Router({ mergeParams: true });
const Restaurant = require('../models/restaurant');
const Review = require('../models/review');
const { reviewSchema } = require('../schemas');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware');

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new AppError(msg, 400);
    } else {
        next();
    }
}

const isReviewAuthor = async(req, res, next) => {
    const { id, reviewId } = req.params
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You Do not Have Permission to Do That!');
        return res.redirect(`/restaurants/${id}`);
    }
    next();
}

router.post('/', isLoggedIn, validateReview, catchAsync(async(req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    restaurant.reviews.push(review);
    await review.save();
    await restaurant.save();
    req.flash('success', 'Successfully Created Review!');
    res.redirect(`/restaurants/${restaurant._id}`);
}));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async(req, res) => {
    const { id, reviewId } = req.params;
    await Restaurant.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully Deleted Review!');
    res.redirect(`/restaurants/${id}`);
}));

module.exports = router;