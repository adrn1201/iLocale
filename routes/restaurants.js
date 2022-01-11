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



module.exports = router;