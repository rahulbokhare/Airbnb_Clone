const joi = require("joi");

module.exports.listingSchema = joi.object({
    listing: joi.object({
        title: joi.string().required(),
        country: joi.string().required(),
        price: joi.number().required().min(0),
        location: joi.string().required(),
        description: joi.string().required(),
        image: joi.string().allow("", null),
    }).required()
});


module.exports.reviewSchema = joi.object({
    review:joi.object({
        rating:joi.number().required(),
        comment:joi.string().required(),

    }).required()
})

module.exports.userSchema = joi.object({
    user:joi.object({
        username: joi.string().required(),
        email: joi.string().required(),
        password: joi.string().required(),
    }).required()
});