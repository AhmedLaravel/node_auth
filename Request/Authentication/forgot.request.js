const joi = require("joi");

module.exports.forgotValidation = joi.object({
    email: joi.string().required().email().lowercase(),

});