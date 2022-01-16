const Restaurant = require('../models/restaurant');
const { cloudinary } = require('../cloudinary');

module.exports.index = async(req, res) => {
    const restaurants = await Restaurant.find({});
    res.render('restaurants/index', { restaurants });
};

module.exports.renderNewForm = (req, res) => {
    res.render('restaurants/new')
};

module.exports.createRestaurant = async(req, res) => {
    const restaurant = new Restaurant(req.body.restaurant);
    restaurant.images = req.files.map(f => ({ url: f.path, filename: f.filename, originalName: f.originalname }));
    restaurant.author = req.user._id;
    await restaurant.save();
    req.flash('success', 'Successfully Created a New Post!');
    res.redirect(`/restaurants/${restaurant._id}`);
};

module.exports.showRestaurants = async(req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!restaurant) {
        req.flash('error', 'Cannot find that restaurant!');
        return res.redirect('/restaurants');
    }
    res.render('restaurants/show', { restaurant });
};

module.exports.renderEditForm = async(req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);
    res.render('restaurants/edit', { restaurant });
};

module.exports.updateRestaurant = async(req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findByIdAndUpdate(id, req.body.restaurant);
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename, originalName: f.originalname }));
    restaurant.images.push(...imgs);
    await restaurant.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await restaurant.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    req.flash('success', 'Successfully Updated Post!');
    res.redirect(`/restaurants/${restaurant._id}`);
};

module.exports.deleteRestaurant = async(req, res) => {
    const { id } = req.params;
    await Restaurant.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted Post!');
    res.redirect('/restaurants');
};