const express = require("express");
const { route } = require("express/lib/router");
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
router.use(verifyToken);
//Permissions
router.get("/permissions", PermissionsController.all);
router.post("/permissions/create", PermissionsController.create);
router.delete("/permissions/delete", PermissionsController.delete);
router.post("/permissions/assignToUser", PermissionsController.assignToUser);

//Roles
router.get("/roles", RolesController.all);
router.post("/roles/create", RolesController.create);
router.delete("/roles/delete", RolesController.delete);
router.post("/roles/assignToUser", RolesController.assignToUser)
router.post("/roles/assignPermission", RolesController.assignPermission)






module.exports = router;