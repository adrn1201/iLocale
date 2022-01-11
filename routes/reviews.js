const express = require('express');
const router = express.Router({ mergeParams: true });
const Restaurant = require('../models/restaurant');
const Review = require('../models/review');

router.post('/', async(req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);
    const review = new Review(req.body.review);
    restaurant.reviews.push(review);
    await review.save();
    await restaurant.save();
    res.redirect(`/restaurants/${restaurant._id}`);
});

module.exports = router;