const express = require('express');
const router = express.Router();
const User = require('../models/user');

const passport = require('passport');
const passwordComplexity = require("joi-password-complexity");
const label = "Password"

const complexityOptions = {
    min: 8,
    max: 20,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 2,
};

const test = passwordComplexity(complexityOptions, label);

const validatePassword = (req, res, next) => {
    const { error } = test.validate(req.body.password);
    if (error) {
        const msgs = error.details.map(el => el.message);
        req.flash('passwordError', msgs);
        res.redirect('/register');
    } else {
        next();
    }
}

router.get('/register', (req, res) => {
    res.render('auth/register');
});

router.post('/register', validatePassword, async(req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to iLocale');
            res.redirect('/restaurants');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
});

router.get('/login', (req, res) => {
    res.render('auth/login');
});

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    const redirectUrl = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;