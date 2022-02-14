const User = require('../models/user');

module.exports.renderSignUp = (req, res) => {
    res.render('auth/signup');
};

module.exports.signUp = async(req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        if (email === process.env.SUPERUSER_EMAIL) {
            user.isSuperUser = true;
            user.isAdmin = true;
        }
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to iLocale');
            res.redirect('/');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup');
    }
};

module.exports.renderLogin = (req, res) => {
    res.render('auth/login');
};

module.exports.login = (req, res) => {
    const redirectUrl = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    res.redirect('/');
}