const Joi = require('joi');

module.exports.restaurantSchema = Joi.object({
    restaurant: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required(),
        rating: Joi.number().min(1).max(5)
    }).required()
});