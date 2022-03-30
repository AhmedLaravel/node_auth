const joi = require("joi");

module.exports.resetValidation = joi.object({
    code: joi.string().min(4).required(),
    password: joi.string().min(6).required()
});