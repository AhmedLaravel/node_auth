const httpErrors = require("http-errors");
const rolesSquelizer = require("../Sequelizer/roles.sequelizer");
const validation = require("../Request/roles.request");

//--------------------------get all permissions-------------------
module.exports.all = async (req, res, next) => {
  try {
    const roles = await rolesSquelizer.all();
    return res.json({
      status: true,
      message: "Roles has been listed successfully",
      data: roles,
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
    var role = await rolesSquelizer.create(req.body);
    if (!role) {
      return res.json({
        status: false,
        message: "Role already exiests",
        data: null,
      });
    }
    return res.json({
      status: true,
      message: "Role has been added successfully",
      data: role,
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
    var role = await rolesSquelizer.delete(validationData.id);
    if (!role) {
      return res.json({
        status: false,
        message: "This Role does not  exiest",
        data: null,
      });
    }
    return res.json({
      status: true,
      message: "Role has been deleted successfully",
      data: role,
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
    var role = await rolesSquelizer.assignToUser(req.body);
    if (!role) {
      return res.json({
        status: false,
        message: "Role does not  exiest",
        data: null,
      });
    }
    return res.json({
      status: true,
      message: "Role has been assigned successfully",
      data:null
    });
  } catch (error) {
    if (error.isJoi === true) error.status = 400;
    next(error);
  }
};


//--------------------------Assign permission to Role-------------------
module.exports.assignPermission = async (req, res, next) => {
  try {
    // Request Validation
    await validation.assignPermission.validateAsync(req.body);
    var role = await rolesSquelizer.assignPermission(req.body);
    if (!role) {
      return res.json({
        status: false,
        message: "Role and/or Permission  is/are not in our database ",
        data: null,
      });
    }
    return res.json({
      status: true,
      message: "Permission has been assigned successfully",
      data:null
    });
  } catch (error) {
    if (error.isJoi === true) error.status = 400;
    next(error);
  }
};

