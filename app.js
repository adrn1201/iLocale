const express = require('express');
const app = express();
const ejsMate = require('ejs-mate');
const path = require('path');
const methodOverride = require('method-override');
const AppError = require('./utils/AppError');
const restaurantRoutes = require('./routes/restaurants');
const reviewRoutes = require('./routes/reviews');

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

app.use('/restaurants', restaurantRoutes);
app.use('/restaurants/:id/reviews', reviewRoutes);

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