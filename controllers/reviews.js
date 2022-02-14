const Business = require('../models/business');
const Review = require('../models/review');

module.exports.createReview = async(req, res) => {
    const { id } = req.params;
    const business = await Business.findById(id).populate('reviews');
    const review = new Review(req.body.review);
    review.author = req.user._id;
    business.reviews.push(review);
    await review.save();
    await business.save();
    if (!business.reviews.length) {
        business.rateAvg = 0;
    } else {
        let totalRatings = business.reviews.map(r => r.rating).reduce((total, current) => total + current);
        business.rateAvg = totalRatings / business.reviews.length;
        business.rateCount = business.reviews.length;
        await business.save();
    }
    req.flash('success', 'Successfully Created Review!');
    res.redirect(`/businesses/${business._id}`);
};

module.exports.deleteReview = async(req, res) => {
    const { id, reviewId } = req.params;
    await Business.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    const business = await Business.findById(id);
    await Review.findByIdAndDelete(reviewId);
    await Business.findByIdAndUpdate(business._id, { rateCount: business.reviews.length });
    req.flash('success', 'Successfully Deleted Review!');
    res.redirect(`/businesses/${id}`);
}