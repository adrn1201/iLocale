const Business = require('../models/business');
const Category = require('../models/category');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');

module.exports.index = async(req, res) => {
    const businesses = await Business.find({}).populate('category');
    res.render('businesses/index', { businesses });
};

module.exports.renderNewForm = async(req, res) => {
    const categories = await Category.find({});
    res.render('businesses/new', { categories })
};

module.exports.createBusiness = async(req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.business.location,
        limit: 1
    }).send()
    const business = new Business(req.body.business);
    business.geometry = geoData.body.features[0].geometry;
    business.category = req.body.business.category;
    business.images = req.files.map(f => ({ url: f.path, filename: f.filename, originalName: f.originalname }));
    business.author = req.user._id;
    await business.save();
    req.flash('success', 'Successfully Created a New Post!');
    res.redirect(`/businesses/${business._id}`);
};

module.exports.showBusinesses = async(req, res) => {
    const { id } = req.params;
    const business = await Business.findById(id).populate('category').populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!business) {
        req.flash('error', 'Cannot find that business!');
        return res.redirect('/businesses');
    }
    res.render('businesses/show', { business });
};

module.exports.renderEditForm = async(req, res) => {
    const { id } = req.params;
    const business = await Business.findById(id).populate('category');
    const categories = await Category.find({});
    res.render('businesses/edit', { business, categories });
};

module.exports.updateBusiness = async(req, res) => {
    const { id } = req.params;
    const business = await Business.findByIdAndUpdate(id, req.body.business);
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename, originalName: f.originalname }));
    business.images.push(...imgs);
    await business.save();
    if (req.body.deleteImages) {
        for (const filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await business.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    req.flash('success', 'Successfully Updated Post!');
    res.redirect(`/businesses/${business._id}`);
};

module.exports.deleteBusiness = async(req, res) => {
    const { id } = req.params;
    await Business.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted Post!');
    res.redirect('/businesses');
};