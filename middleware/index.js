const Business = require('../models/business');
const Review = require('../models/review');
const Category = require('../models/category');
const { businessSchema, reviewSchema, contactSchema, categorySchema } = require('../schemas');
const AppError = require('../utils/AppError');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You Must Be Signed in First!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateBusiness = (req, res, next) => {
    const { error } = businessSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new AppError(msg, 400);
    } else {
        next();
    }
}

module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params
    const business = await Business.findById(id);
    if (business.author.equals(req.user._id) || (req.user.isAdmin && !business.author.isSuperUser) || req.user.isSuperUser) {
        next();
    } else {
        req.flash('error', 'You Do not Have Permission to Do That!');
        return res.redirect(`/businesses/${business._id}`);
    }

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
    if (review.author.equals(req.user._id) || (req.user.isAdmin && !review.author.isSuperUser) || req.user.isSuperUser) {
        next();
    } else {
        req.flash('error', 'You Do not Have Permission to Do That!');
        return res.redirect(`/businesses/${id}`);
    }
}

module.exports.isAdministrative = async(req, res, next) => {
    if (!req.user.isAdmin) {
        req.flash('error', 'You Do not Have Permission to Do That!');
        return res.redirect(`/`);
    }
    next();
}

module.exports.isSuperUser = async(req, res, next) => {
    if (!req.user.isSuperUser) {
        req.flash('error', 'You Do not Have Permission to Do That!');
        return res.redirect(`/`);
    }
    next();
}

module.exports.validateContact = (req, res, next) => {
    const { error } = contactSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new AppError(msg, 400);
    } else {
        next();
    }
}

module.exports.validateCategory = (req, res, next) => {
    const { error } = categorySchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new AppError(msg, 400);
    } else {
        next();
    }
}