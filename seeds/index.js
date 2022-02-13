const mongoose = require('mongoose');
const Business = require('../models/business');
const Category = require('../models/category');
const cities = require('./cities');
const { businesses } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/iLocale')
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => { console.log('Database connected'); });

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {
    await Business.deleteMany({});
    for (let i = 0; i < 60; i++) {
        const rand1000 = Math.floor(Math.random() * 1000);
        const business = new Business({
            author: '6208f0f3876edba768acdc2e',
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[rand1000].longitude,
                    cities[rand1000].latitude
                ]
            },
            category: '6208f17353f74f45c16e06ad', //61e7d86ad931da6487316924, 61e7ae87ccc1bbbb0a25b726
            title: `${sample(businesses)}`,
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est, unde cupiditate! Aliquid quidem nostrum enim molestias nulla eius consequatur consectetur eligendi pariatur. Fuga atque error explicabo obcaecati, debitis quaerat doloremque.',
            images: [{
                url: 'https://res.cloudinary.com/dofxpwwou/image/upload/v1642398778/iLocale/w2cjwlko98y1i8z1vtx2.jpg',
                filename: 'iLocale/w2cjwlko98y1i8z1vtx2',
                originalName: 'yum2.jpg'
            }]
        });
        const category = await Category.findById(business.category);
        category.businesses.push(business);
        await business.save();
        await category.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});