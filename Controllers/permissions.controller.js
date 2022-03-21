const httpErrors = require("http-errors");
const permissionsSequlizer = require("../Sequelizer/permissions.sequelizer");
const validation = require("../Request/permission.request");

//--------------------------get all permissions-------------------
module.exports.all = async (req, res, next) => {
  try {
    const permissions = await permissionsSequlizer.all();
    return res.json({
      status: true,
      message: "Permissions has been listed successfully",
      data: permissions,
    });
  } catch (error) {
    next(error);
  }
};

//--------------------------Create permissions-------------------
module.exports.create = async (req, res, next) => {
  try {
    // Request Validation
    await validation.create.validateAsync(req.body);
    var permission = await permissionsSequlizer.create(req.body);
    if (!permission) {
      return res.json({
        status: false,
        message: "permission already exiests",
        data: null,
      });
    }
    return res.json({
      status: true,
      message: "Permissions has been added successfully",
      data: permission,
    });
  } catch (error) {
    if (error.isJoi === true) error.status = 400;
    next(error);
  }
};

//--------------------------Delete permissions-------------------
module.exports.delete = async (req, res, next) => {
  try {
    // Request Validation
    const validationData = await validation.delete.validateAsync(req.body);
    var permission = await permissionsSequlizer.delete(validationData.id);
    if (!permission) {
      return res.json({
        status: false,
        message: "This permission does not  exiest",
        data: null,
      });
    }
    return res.json({
      status: true,
      message: "Permissions has been deleted successfully",
      data: permission,
    });
  } catch (error) {
    if (error.isJoi === true) error.status = 400;
    next(error);
  }
};

//--------------------------Assign permission to User-------------------
module.exports.assignToUser = async (req, res, next) => {
  try {
    // Request Validation
    await validation.assignToUser.validateAsync(req.body);
    var permission = await permissionsSequlizer.assignToUser(req.body);
    if (!permission) {
      return res.json({
        status: false,
        message: "permission does not  exiest",
        data: null,
      });
    }
    return res.json({
      status: true,
      message: "Permissions has been assigned successfully",
      data:null
    });
  } catch (error) {
    if (error.isJoi === true) error.status = 400;
    next(error);
  }
};

