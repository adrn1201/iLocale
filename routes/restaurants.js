const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateRestaurant, isAuthor } = require('../middleware');
const restaurants = require('../controllers/restaurants');

router.route('/')
    .get(catchAsync(restaurants.index))
    .post(isLoggedIn, validateRestaurant, catchAsync(restaurants.createRestaurant));

router.get('/new', isLoggedIn, restaurants.renderNewForm);

router.route('/:id')
    .get(catchAsync(restaurants.showRestaurants))
    .put(isLoggedIn, isAuthor, validateRestaurant, catchAsync(restaurants.updateRestaurant))
    .delete(isLoggedIn, isAuthor, catchAsync(restaurants.deleteRestaurant));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(restaurants.renderEditForm));

module.exports = router;