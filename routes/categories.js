const express = require('express');
const router = express.Router();
const categories = require('../controllers/categories');

router.route('/')
    .get(categories.index)
    .post(categories.createCategory);

router.get('/new', categories.renderNewForm);

router.route('/:id')
    .put(categories.updateCategory)
    .delete(categories.deleteCategory);

router.get('/:id/edit', categories.renderEditForm);


module.exports = router;