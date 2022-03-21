const express = require("express");
const router = express.Router();
const AuthController = require("../Controllers/authentication.controller");
const PermissionsController = require("../Controllers/permissions.controller");
const RolesController = require("../Controllers/roles.controller");
const { verifyToken } = require("../Middlewares/auh.middleware");

//------------------------Authentication --------------------
router.post("/register", AuthController.register);
router.post("/verify/user", AuthController.verifyUser);

router.post("/login", AuthController.login);

router.post("/token/refresh", AuthController.refresh);

router.delete("/logout", AuthController.logout);

//------------------------Roles and Permissions ---------------

//Permissions
router.get("/permissions", verifyToken, PermissionsController.all);
router.post("/permissions/create", verifyToken, PermissionsController.create);
router.delete("/permissions/delete", verifyToken, PermissionsController.delete);
router.post("/permissions/assignToUser", verifyToken, PermissionsController.assignToUser);

//Roles
router.get("/roles", verifyToken, RolesController.all);
router.post("/roles/create", verifyToken, RolesController.create);
router.delete("/roles/delete", verifyToken, RolesController.delete);
router.post("/roles/assignToUser", verifyToken, RolesController.assignToUser)
router.post("/roles/assignPermission", verifyToken, RolesController.assignPermission)






module.exports = router;