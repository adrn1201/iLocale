const mongoose = require('mongoose');
const Restaurant = require('../models/restaurant');
const cities = require('./cities');
const { restaurants } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/iLocale')
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => { console.log('Database connected'); });

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {
    await Restaurant.deleteMany({});
    for (let i = 0; i < 9; i++) {
        const rand1000 = Math.floor(Math.random() * 1000);
        const restaurant = new Restaurant({
            author: '61e4e0366a75a5fdf7c221e5',
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
            geometry: {
                type: 'Point',
                coordinates: [-73.9866, 40.7306]
            },
            title: `${sample(restaurants)}`,
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est, unde cupiditate! Aliquid quidem nostrum enim molestias nulla eius consequatur consectetur eligendi pariatur. Fuga atque error explicabo obcaecati, debitis quaerat doloremque.',
            images: [{
                url: 'https://res.cloudinary.com/dofxpwwou/image/upload/v1642398778/iLocale/w2cjwlko98y1i8z1vtx2.jpg',
                filename: 'iLocale/w2cjwlko98y1i8z1vtx2',
                originalName: 'yum2.jpg'
            }]
        });
        await restaurant.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});