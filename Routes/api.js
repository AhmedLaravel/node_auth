const express = require("express");
const passport = require("passport");
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
router.post("/forgot", AuthController.forget);
router.post("/reset", AuthController.reset);

router.post("/token/refresh", AuthController.refresh);

router.delete("/logout", AuthController.logout);

//----------------------------Social Login-------------------------
router.get("/user/token/:accessToken/:refreshToken", async (req, res, next)=>{
    console.log(req.body.token)
    return res.json({
        status: true,
        message: "token has been retrieved successfully",
        data: {
            accessToken: req.params.accessToken,
            refreshToken: req.params.refreshToken
        },
      });
});

// Facebook authentication strategy
router.use('/auth/facebook', passport.authenticate('facebook', {scope: [ "email" ]}))
router.get("/facebook/callback",AuthController.facebookLogin);

// Google authentication strategy
router.use('/auth/google', passport.authenticate('google', {scope: [ "profile","email" ]}))
router.get("/google/callback",AuthController.googleLogin);

//------------------------Roles and Permissions ---------------
// router.use(verifyToken);
//Permissions
router.get("/permissions",verifyToken, PermissionsController.all);
router.post("/permissions/create",verifyToken, PermissionsController.create);
router.delete("/permissions/delete",verifyToken, PermissionsController.delete);
router.post("/permissions/assignToUser",verifyToken, PermissionsController.assignToUser);

//Roles
router.get("/roles",verifyToken, RolesController.all);
router.post("/roles/create",verifyToken, RolesController.create);
router.delete("/roles/delete",verifyToken, RolesController.delete);
router.post("/roles/assignToUser",verifyToken, RolesController.assignToUser)
router.post("/roles/assignPermission",verifyToken, RolesController.assignPermission)






module.exports = router;