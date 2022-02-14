const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAdministrative, validateCategory } = require('../middleware')
const categories = require('../controllers/categories');

router.route('/')
    .get(isLoggedIn, isAdministrative, catchAsync(categories.index))
    .post(isLoggedIn, isAdministrative, validateCategory, catchAsync(categories.createCategory));

router.get('/new', isLoggedIn, isAdministrative, categories.renderNewForm);

router.route('/:id')
    .put(isLoggedIn, isAdministrative, validateCategory, catchAsync(categories.updateCategory))
    .delete(isLoggedIn, isAdministrative, catchAsync(categories.deleteCategory));

router.get('/:id/edit', isLoggedIn, isAdministrative, catchAsync(categories.renderEditForm));


module.exports = router;