const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isCategoryAuthor } = require('../middleware')
const categories = require('../controllers/categories');

router.route('/')
    .get(isLoggedIn, catchAsync(categories.index))
    .post(isLoggedIn, catchAsync(categories.createCategory));

router.get('/new', isLoggedIn, categories.renderNewForm);

router.route('/:id')
    .put(isLoggedIn, isCategoryAuthor, catchAsync(categories.updateCategory))
    .delete(isLoggedIn, isCategoryAuthor, catchAsync(categories.deleteCategory));

router.get('/:id/edit', isLoggedIn, isCategoryAuthor, catchAsync(categories.renderEditForm));


module.exports = router;