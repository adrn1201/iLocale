const express = require('express');
const router = express.Router();
const Restaurant = require('../models/restaurant');

/*

RESTFUL API

GET -> /restaurants
GET -> /restaurants/new
POST -> /restaurants
GET -> /restaurants/:id
GET -> /restaurants/:id/edit
PUT-> /restaurants/:id
DELETE -> /restaurants/:id

*/
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
    const restaurant = await Restaurant.findById(id);
    res.render('restaurants/show', { restaurant });
});

router.get('/:id/edit', async(req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);
    res.render('restaurants/edit', { restaurant });
});



module.exports = router;