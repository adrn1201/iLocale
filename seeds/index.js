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
            author: '6209f782a7b2bc18c29a4c25',
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[rand1000].longitude,
                    cities[rand1000].latitude
                ]
            },
            category: '6209f78ca7b2bc18c29a4c33', //61e7d86ad931da6487316924, 61e7ae87ccc1bbbb0a25b726
            title: `${sample(businesses)}`,
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est, unde cupiditate! Aliquid quidem nostrum enim molestias nulla eius consequatur consectetur eligendi pariatur. Fuga atque error explicabo obcaecati, debitis quaerat doloremque.',
            images: [{
                url: 'https://res.cloudinary.com/dofxpwwou/image/upload/v1643261506/iLocale/ebnnrzn5rfdnuf4p63nw.jpg',
                filename: 'iLocale/ebnnrzn5rfdnuf4p63nw',
                originalName: 'salad.jpg'
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