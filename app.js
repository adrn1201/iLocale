if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const ejsMate = require('ejs-mate');
const path = require('path');
const methodOverride = require('method-override');
const Category = require('./models/category');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/categories');
const businessRoutes = require('./routes/businesses');
const reviewRoutes = require('./routes/reviews');
const AppError = require('./utils/AppError');
const catchAsync = require('./utils/catchAsync');
const session = require('express-session');
const flash = require('connect-flash');
const User = require('./models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const mongoose = require('mongoose');
const port = process.env.PORT || 3000;

/* DB Section CONNECTION */
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/iLocale';

mongoose.connect(dbUrl)
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => { console.log('Database connected'); });

/* end of Section CONNECTION */

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const sessionConfig = {
    name: 'session',
    secret: 'devmodesecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(catchAsync(async(req, res, next) => {
    req.session.categories = await Category.find({});
    next();
}));

app.use((req, res, next) => {
    res.locals.categories = req.session.categories;
    res.locals.sortBy = req.query.sortBy;
    res.locals.title = req.query.title;
    res.locals.location = req.query.location
    res.locals.path = req.path;
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.passwordError = req.flash('passwordError');
    next();
});

app.use('/', userRoutes);
app.use('/admin/categories', adminRoutes);
app.use('/businesses', businessRoutes);
app.use('/businesses/:id/reviews', reviewRoutes);

app.get('/', (req, res) => {
    res.render('home');
});

app.all('*', (req, res, next) => {
    return next(new AppError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something Went Wrong!';
    res.status(statusCode).render('error', { err });
});

app.listen(port, () => {
    console.log(`Serving on port ${port}`);
});