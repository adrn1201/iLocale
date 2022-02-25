const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isCurrentUser } = require('../middleware');
const { validatePassword } = require('../middleware/password');
const catchAsync = require('../utils/catchAsync');
const users = require('../controllers/users');

router.get('/auth/google', isCurrentUser, passport.authenticate('google', {
    scope: ['email', 'profile']
}));

router.get('/google/callback', isCurrentUser, passport.authenticate('google', { failureRedirect: '/login', failureFlash: true }), users.login);

router.route('/signup')
    .get(isCurrentUser, users.renderSignUp)
    .post(isCurrentUser, validatePassword, catchAsync(users.signUp));

router.route('/login')
    .get(isCurrentUser, users.renderLogin)
    .post(isCurrentUser, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

router.get('/logout', users.logout);

module.exports = router;