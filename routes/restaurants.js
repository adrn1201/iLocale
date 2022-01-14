const express = require('express');
const router = express.Router();
const Restaurant = require('../models/restaurant');
const { restaurantSchema } = require('../schemas');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { isLoggedIn } = require('../middleware');

const validateRestaurant = (req, res, next) => {
    const { error } = restaurantSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new AppError(msg, 400);
    } else {
        next();
    }
}

const isAuthor = async(req, res, next) => {
    const { id } = req.params
    const restaurant = await Restaurant.findById(id);
    if (!restaurant.author.equals(req.user._id)) {
        req.flash('error', 'You Do not Have Permission to Do That!');
        return res.redirect(`/restaurants/${restaurant._id}`);
    }
    next();
}

router.get('/', catchAsync(async(req, res) => {
    const restaurants = await Restaurant.find({});
    res.render('restaurants/index', { restaurants });
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('restaurants/new')
});

router.post('/', isLoggedIn, validateRestaurant, catchAsync(async(req, res) => {
    const restaurant = new Restaurant(req.body.restaurant);
    restaurant.author = req.user._id;
    await restaurant.save();
    req.flash('success', 'Successfully Created a New Post!');
    res.redirect(`/restaurants/${restaurant._id}`);
}));

router.get('/:id', catchAsync(async(req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!restaurant) {
        req.flash('error', 'Cannot find that restaurant!');
        return res.redirect('/restaurants');
    }
    res.render('restaurants/show', { restaurant });
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async(req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);
    res.render('restaurants/edit', { restaurant });
}));

router.put('/:id', isLoggedIn, isAuthor, validateRestaurant, catchAsync(async(req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findByIdAndUpdate(id, req.body.restaurant);
    req.flash('success', 'Successfully Updated Post!');
    res.redirect(`/restaurants/${restaurant._id}`);
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async(req, res) => {
    const { id } = req.params;
    await Restaurant.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted Post!');
    res.redirect('/restaurants');
}));

module.exports = router;