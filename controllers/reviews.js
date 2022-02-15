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

    let totalRatings = business.reviews.map(r => r.rating).reduce((total, current) => total + current);
    averageRating = totalRatings / business.reviews.length;
    totalRateCount = business.reviews.length;
    await Business.findByIdAndUpdate(id, { rateAvg: averageRating, rateCount: totalRateCount });

    req.flash('success', 'Successfully Created Review!');
    res.redirect(`/businesses/${business._id}`);
};

module.exports.updateReview = async(req, res) => {
    const { id, reviewId } = req.params;
    const { rating, body } = req.body.review;
    await Review.findByIdAndUpdate(reviewId, { rating, body });

    const business = await Business.findById(id).populate('reviews');
    let totalRatings = business.reviews.map(r => r.rating).reduce((total, current) => total + current);
    business.rateAvg = totalRatings / business.reviews.length;
    await business.save();
    req.flash('success', 'Successfully Updated Review!');
    res.redirect(`/businesses/${id}`);
};

module.exports.deleteReview = async(req, res) => {
    const { id, reviewId } = req.params;
    await Business.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    const business = await Business.findById(id).populate('reviews');

    if (business.reviews.length) {
        let totalRatings = business.reviews.map(r => r.rating).reduce((total, current) => total + current);
        business.rateAvg = totalRatings / business.reviews.length;
        business.rateCount = business.reviews.length;
        await business.save();
    } else {
        business.rateAvg = 0;
        business.rateCount = business.reviews.length;
        await business.save();
    }

    req.flash('success', 'Successfully Deleted Review!');
    res.redirect(`/businesses/${id}`);
}