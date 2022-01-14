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

router.get('/', catchAsync(async(req, res) => {
    const restaurants = await Restaurant.find({});
    res.render('restaurants/index', { restaurants });
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('restaurants/new')
});

router.post('/', isLoggedIn, validateRestaurant, catchAsync(async(req, res) => {
    const restaurant = new Restaurant(req.body.restaurant);
    await restaurant.save();
    req.flash('success', 'Successfully Created a New Post!');
    res.redirect(`/restaurants/${restaurant._id}`);
}));

router.get('/:id', catchAsync(async(req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id).populate('reviews');
    res.render('restaurants/show', { restaurant });
}));

router.get('/:id/edit', isLoggedIn, catchAsync(async(req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);
    res.render('restaurants/edit', { restaurant });
}));

router.put('/:id', isLoggedIn, validateRestaurant, catchAsync(async(req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findByIdAndUpdate(id, req.body.restaurant);
    req.flash('success', 'Successfully Updated Post!');
    res.redirect(`/restaurants/${restaurant._id}`);
}));

router.delete('/:id', isLoggedIn, catchAsync(async(req, res) => {
    const { id } = req.params;
    await Restaurant.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted Post!');
    res.redirect('/restaurants');
}));

module.exports = router;