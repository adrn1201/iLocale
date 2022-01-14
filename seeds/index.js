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
            author: '61e10fa6e4983cd57cd5be92',
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
            title: `${sample(restaurants)}`,
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est, unde cupiditate! Aliquid quidem nostrum enim molestias nulla eius consequatur consectetur eligendi pariatur. Fuga atque error explicabo obcaecati, debitis quaerat doloremque.',
            images: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80'
        });
        await restaurant.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});