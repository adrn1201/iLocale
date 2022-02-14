const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { validateContact } = require('../middleware')
const contact = require('../controllers/contact');

router.route('/')
    .get(contact.renderContact)
    .post(validateContact, catchAsync(contact.sendEmail));

module.exports = router;