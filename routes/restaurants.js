const express = require('express');
const router = express.Router();
const Restaurant = require('../models/restaurant');

router.get('/', async(req, res) => {
    const restaurants = await Restaurant.find({});
    res.render('restaurants/index', { restaurants });
});

router.get('/new', (req, res) => {
    res.render('restaurants/new')
});

router.post('/', async(req, res) => {
    const restaurant = new Restaurant(req.body.restaurant);
    await restaurant.save();
    res.redirect(`/restaurants/${restaurant._id}`);
});

router.get('/:id', async(req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id).populate('reviews');
    res.render('restaurants/show', { restaurant });
});

router.get('/:id/edit', async(req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);
    res.render('restaurants/edit', { restaurant });
});

router.put('/:id', async(req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findByIdAndUpdate(id, req.body.restaurant);
    res.redirect(`/restaurants/${restaurant._id}`);
});

router.delete('/:id', async(req, res) => {
    const { id } = req.params;
    await Restaurant.findByIdAndDelete(id);
    res.redirect('/restaurants');
});

module.exports = router;