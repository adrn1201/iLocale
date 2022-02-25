if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const ejsMate = require('ejs-mate');
const path = require('path');
const methodOverride = require('method-override');
const Category = require('./models/category');
const { home } = require('./controllers/home')
const userRoutes = require('./routes/users');
const contactRoute = require('./routes/contact');
const categoryRoute = require('./routes/categories');
const manageUserRoute = require('./routes/superuser');
const businessRoutes = require('./routes/businesses');
const reviewRoutes = require('./routes/reviews');
const AppError = require('./utils/AppError');
const catchAsync = require('./utils/catchAsync');
const expressSanitizer = require('express-sanitizer');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const User = require('./models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
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

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(mongoSanitize({
    replaceWith: '_'
}));

const secret = process.env.SECRET || 'devmodesecret!';

const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function(e) {
    console.log("SESSION STORE ERROR: ", e);
});

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

const scriptSrcUrls = [];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com",
    "https://stackpath.bootstrapcdn.com",
    "https://api.mapbox.com",
    "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
];
const connectSrcUrls = [
    "https://api.mapbox.com",
    "https://*.tiles.mapbox.com",
    "https://events.mapbox.com",
];
const fontSrcUrls = [
    'https://fonts.gstatic.com'
];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dofxpwwou/",
                "https://images.unsplash.com",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
app.use(expressSanitizer());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/google/callback",
        passReqToCallback: true
    },
    async function(request, accessToken, refreshToken, profile, done) {
        const foundUser = await User.findOne({ googleId: profile.id })
        if (foundUser) {
            done(null, foundUser);
        } else {
            const newUser = new User({
                email: profile.email,
                googleId: profile.id,
                username: profile.displayName
            });
            if (newUser.email === process.env.SUPERUSER_EMAIL) {
                newUser.isSuperUser = true;
                newUser.isAdmin = true;
            }
            await newUser.save();
            done(null, newUser);
        }
    }
));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(catchAsync(async(req, res, next) => {
    req.session.categories = await Category.find({});
    next();
}));

app.use((req, res, next) => {
    res.locals.categories = req.session.categories;
    res.locals.partialCategory = req.query.category;
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
app.use('/contact', contactRoute);
app.use('/admin/categories', categoryRoute);
app.use('/superuser/users', manageUserRoute);
app.use('/businesses', businessRoutes);
app.use('/businesses/:id/reviews', reviewRoutes);

app.get('/', catchAsync(home));

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