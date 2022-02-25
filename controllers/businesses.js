const Business = require('../models/business');
const Category = require('../models/category');
const Review = require('../models/review');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');
const { sortValues } = require('../utils/sortValues');

module.exports.index = async(req, res) => {
    const { title, location, page, category, sortBy } = req.query;
    const sort = {};
    let foundCategory = {};

    if (sortBy && (sortBy.split(':')[0] === 'createdAt')) {
        const pages = sortBy.split(':');
        sort[pages[0]] = pages[1] === 'desc' ? -1 : 1
    } else if (sortBy && sortBy === 'mostReviewed') {
        sort['rateCount'] = -1
    }

    if (category) {
        foundCategory = await Category.findOne({ categoryName: category });
    }

    if (!page && (title || location || category)) {
        const businesses = await Business
            .paginate({ $or: [{ title }, { location }, { category: foundCategory._id }] }, {
                populate: {
                    path: 'category'
                },
                collation: {
                    locale: 'en',
                    strength: 2
                },
                sort
            })
        res.render('businesses/index', { businesses, title, location, category, displaySort: sortValues() });
    } else if (!page && (!title || !location || !category)) {
        const businesses = await Business.paginate({}, {
            populate: {
                path: 'category'
            },
            sort
        });
        res.render('businesses/index', { businesses, title: '', location: '', category: '', displaySort: sortValues() })
    } else if (page && (title || location || category)) {
        const foundCategory = await Category.findOne({ categoryName: category });
        const businesses = await Business.paginate({ $or: [{ title }, { location }, { category: foundCategory._id }] }, {
            page,
            populate: {
                path: 'category'
            },
            collation: {
                locale: 'en',
                strength: 2
            },
            sort
        });
        res.status(200).json(businesses);
    } else {
        const businesses = await Business.paginate({}, {
            page,
            populate: {
                path: 'category'
            },
            sort
        });
        res.status(200).json(businesses);
    }
}

module.exports.renderNewForm = async(req, res) => {
    const categories = await Category.find({});
    res.render('businesses/new', { categories })
};

module.exports.createBusiness = async(req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.business.location,
        limit: 1
    }).send()
    const category = await Category.findById(req.body.business.category);
    const business = new Business({
        ...req.body.business,
        geometry: geoData.body.features[0].geometry,
        category: req.body.business.category,
        images: req.files.map(f => ({ url: f.path, filename: f.filename, originalName: f.originalname })),
        author: req.user._id
    });
    category.businesses.push(business);
    await business.save();
    await category.save();
    req.flash('success', 'Successfully Created a New Post!');
    res.redirect(`/businesses/${business._id}`);
};

module.exports.showBusinesses = async(req, res) => {
    const { id } = req.params;
    const { page } = req.query;
    const business = await Business.findById(id).populate('category').populate('author');
    if (!business) {
        req.flash('error', 'Cannot find that business!');
        return res.redirect('/businesses');
    }

    if (page) {
        const reviews = await Review.paginate({ _id: { $in: business.reviews } }, {
            page,
            populate: {
                path: 'author'
            },
            limit: 5
        });
        res.status(200).json(reviews);
    } else {
        const reviews = await Review.paginate({ _id: { $in: business.reviews } }, {
            populate: {
                path: 'author'
            },
            limit: 5
        });
        res.render('businesses/show', { business, reviews });
    }
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
    const business = await Business.findById(id);
    await Category.findByIdAndUpdate(business.category, { $pull: { businesses: id } });
    await Business.findByIdAndDelete({ _id: business._id });
    req.flash('success', 'Successfully Deleted Post!');
    res.redirect('/businesses');
};