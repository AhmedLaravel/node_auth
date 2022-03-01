const joi = require("joi");

module.exports.loginValidation = joi.object({
    email: joi.string().required().email().lowercase(),
    password: joi.string().min(6).required()
});