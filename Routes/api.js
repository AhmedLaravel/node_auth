const express = require("express");
const router = express.Router();
const AuthController = require("../Controllers/AuthController");
router.post("/register", AuthController.register);
router.post("/verify/user", AuthController.verifyUser);

router.post("/login", AuthController.login);

router.post("/token/refresh", AuthController.refresh);

router.delete("/logout", AuthController.logout);







module.exports = router;