const Joi = require('joi');

module.exports.businessSchema = Joi.object({
    business: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        category: Joi.string().required(),
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required(),
        rating: Joi.number().min(1).max(5)
    }).required()
});

module.exports.contactSchema = Joi.object({
    contact: Joi.object({
        name: Joi.string().required(),
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        message: Joi.string().required()
    }).required()
});

module.exports.categorySchema = Joi.object({
    category: Joi.object({
        categoryName: Joi.string().required(),
    }).required()
});