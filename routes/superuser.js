const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isSuperUser } = require('../middleware')
const superuser = require('../controllers/superuser');

router.get('/', isLoggedIn, isSuperUser, catchAsync(superuser.renderUserData));

router.route('/:id')
    .put(isLoggedIn, isSuperUser, catchAsync(superuser.updateUserRole))
    .delete(isLoggedIn, isSuperUser, catchAsync(superuser.deleteUser));

router.get('/:id/edit', isLoggedIn, isSuperUser, catchAsync(superuser.renderEditForm));

module.exports = router;