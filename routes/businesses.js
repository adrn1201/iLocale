const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateBusiness, isAuthor } = require('../middleware');
const businesses = require('../controllers/businesses');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(businesses.index))
    .post(isLoggedIn, upload.array('image'), validateBusiness, catchAsync(businesses.createBusiness));

router.get('/new', isLoggedIn, businesses.renderNewForm);

router.route('/:id')
    .get(catchAsync(businesses.showBusinesses))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateBusiness, catchAsync(businesses.updateBusiness))
    .delete(isLoggedIn, isAuthor, catchAsync(businesses.deleteBusiness));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(businesses.renderEditForm));

module.exports = router;