const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware')
const contact = require('../controllers/contact');

router.route('/')
    .get(isLoggedIn, contact.renderContact)
    .post(isLoggedIn, catchAsync(contact.sendEmail));

module.exports = router;