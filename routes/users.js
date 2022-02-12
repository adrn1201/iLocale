const express = require('express');
const router = express.Router();
const passport = require('passport');
const { validatePassword } = require('../middleware/password');
const catchAsync = require('../utils/catchAsync');
const users = require('../controllers/users');

router.get('/auth/google', passport.authenticate('google', {
    scope: ['email', 'profile']
}));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login', failureFlash: true }), users.login);

router.route('/signup')
    .get(users.renderSignUp)
    .post(validatePassword, catchAsync(users.signUp));

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

router.get('/logout', users.logout);

module.exports = router;