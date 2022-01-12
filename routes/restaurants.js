const express = require('express');
const router = express.Router();
const Restaurant = require('../models/restaurant');
const { restaurantSchema } = require('../schemas');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

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

router.get('/new', (req, res) => {
    res.render('restaurants/new')
});

router.post('/', validateRestaurant, catchAsync(async(req, res) => {
    const restaurant = new Restaurant(req.body.restaurant);
    await restaurant.save();
    res.redirect(`/restaurants/${restaurant._id}`);
}));

router.get('/:id', catchAsync(async(req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id).populate('reviews');
    res.render('restaurants/show', { restaurant });
}));

router.get('/:id/edit', catchAsync(async(req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);
    res.render('restaurants/edit', { restaurant });
}));

router.put('/:id', validateRestaurant, catchAsync(async(req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findByIdAndUpdate(id, req.body.restaurant);
    res.redirect(`/restaurants/${restaurant._id}`);
}));

router.delete('/:id', catchAsync(async(req, res) => {
    const { id } = req.params;
    await Restaurant.findByIdAndDelete(id);
    res.redirect('/restaurants');
}));

module.exports = router;