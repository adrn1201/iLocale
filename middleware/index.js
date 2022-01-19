const Restaurant = require('../models/restaurant');
const Review = require('../models/review');
const Category = require('../models/category');
const { restaurantSchema, reviewSchema } = require('../schemas');
const AppError = require('../utils/AppError');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You Must Be Signed in First!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateRestaurant = (req, res, next) => {
    const { error } = restaurantSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new AppError(msg, 400);
    } else {
        next();
    }
}

module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params
    const restaurant = await Restaurant.findById(id);
    if (!restaurant.author.equals(req.user._id)) {
        req.flash('error', 'You Do not Have Permission to Do That!');
        return res.redirect(`/restaurants/${restaurant._id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new AppError(msg, 400);
    } else {
        next();
    }
}

module.exports.isReviewAuthor = async(req, res, next) => {
    const { id, reviewId } = req.params
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You Do not Have Permission to Do That!');
        return res.redirect(`/restaurants/${id}`);
    }
    next();
}

module.exports.isCategoryAuthor = async(req, res, next) => {
    const { id } = req.params;
    const category = await Restaurant.findById(id);
    if (!category.author.equals(req.user._id)) {
        req.flash('error', 'You Do not Have Permission to Do That!');
        return res.redirect(`/admin/categories`);
    }
    next();
}