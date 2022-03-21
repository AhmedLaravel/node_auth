const joi = require("joi");

//--------------------Create Permission validation---------------------
module.exports.create = joi.object({
    name: joi.string().required(),
    slug: joi.string().required(),
});

//--------------------Delete Permission validation---------------------
module.exports.delete = joi.object({
    id:joi.number().integer().min(1)
});

//--------------------Assign Permission to user validation---------------------
module.exports.assignToUser = joi.object({
    userId:joi.number().integer().min(1),
    permissionId:joi.number().integer().min(1)
});