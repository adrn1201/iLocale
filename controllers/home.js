const Business = require('../models/business');

module.exports.home = async(req, res) => {
    const businesses = await Business.find({ rateCount: { $gte: 5 } }).populate('category').limit(5);
    res.render('home', { businesses });
};