const httpErrors = require("http-errors");
const bcrypt = require("bcrypt");
const passport = require("passport");
const userRequest = require("../Request/Authentication/user.request");
const userSequlizer = require("../Sequelizer/user.sequelizer");
const verificationEmail = require("../Mailer/verification_email");
const { forgotEmail } = require("../Mailer/forgot.mailer");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../Helpers/jwt.helper");
const validation = require("../Request/Authentication/login.request");
const { forgotValidation } = require("../Request/Authentication/forgot.request");
const { resetValidation } = require("../Request/Authentication/reset.request");

//--------------------------------------User registeration------------------
module.exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      next(httpErrors.BadRequest());
    }
    // Request Validation
    const validationErrors = userRequest.userValidation(req.body);
    if (validationErrors) {
      return res.json(validationErrors);
    }
    var exists = await userSequlizer.isUser(req.body.email);
    if (exists) {
      return res.json({
        status: false,
        message: "User already Exists",
        data: null,
      });
    }
    var user = await userSequlizer.addUser(req.body);
    await verificationEmail.verificationEmail(user);
    return res.json({
      status: true,
      message: "Please check your email to verify your password",
      data: {
        id: user.id,
        userName: user.name,
        userEmail: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

//--------------------------------------User verification------------------
module.exports.verifyUser = async (req, res, next) => {
  //request validation
  const validationErrors = userRequest.verificationValidation(req.body);
  if (validationErrors) {
    return res.json(validationErrors);
  }
  const isCodeValid = await userSequlizer.isCodeValid(req.body);
  if (!isCodeValid) {
    return res.json({
      status: false,
      message: "the verification code is invalid",
      data: null,
    });
  }
  let verifiedUser = await userSequlizer.verifyUser(req.body);

  return res.json({
    status: true,
    message: "user has been verified successfully",
    data: {
      id: verifiedUser.id,
      isVerified: verifiedUser.isVerified,
      userName: verifiedUser.name,
      userEmail: verifiedUser.email,
    },
  });
};
//----------------------Login Authentication--------------------
module.exports.login = async (req, res, next) => {
  try {
    const validResponse = await validation.loginValidation.validateAsync(
      req.body
    );
    const user = await userSequlizer.getUserByEmail(validResponse.email);
    if (!user)
      throw httpErrors.NotFound(
        "You are not registered, Please register first"
      );
    if (!(await bcrypt.compare(req.body.password, user.password)))
      throw httpErrors.Unauthorized("Wrong email or password");
    if (!(await userSequlizer.isVerified(user.id)))
      throw httpErrors.Unauthorized("Please verify your account first");
    const accessToken = await generateAccessToken(user.id);
    const refreshToken = await generateRefreshToken(user.id);
    return res.json({
      status: true,
      message: "User logged in successfully",
      data: {
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: {
          id: user.id,
          userName: user.name,
          userEmail: user.email,
        },
      },
    });
  } catch (error) {
    if (error.isJoi === true) error.status = 400;
    next(error);
  }
};
//--------------------Forgot password---------------
module.exports.forget = async (req, res, next) => {
  try {
    const validResponse = await forgotValidation.validateAsync(
      req.body
    );
    const user = await userSequlizer.getUserByEmail(validResponse.email);
    if (!user)
      throw httpErrors.NotFound(
        "You are not registered, Please register first"
      );
    if (!(await userSequlizer.isVerified(user.id)))
      throw httpErrors.Unauthorized("Please verify your account first");
    const userReset = await userSequlizer.createPasswordReset(user.id);
      await forgotEmail(userReset);
    return res.json({
      status: true,
      message: "Please check your email for the reset code",
      data: {
        user: {
          id: userReset.user.id,
          userName: userReset.user.name,
          userEmail: userReset.user.email,
        },
      },
    });
  } catch (error) {
    if (error.isJoi === true) error.status = 400;
    next(error);
  }
};

//----------------------------reset password------------------
module.exports.reset= async (req, res, next) => {
  try {
    const validResponse = await resetValidation.validateAsync(
      req.body
    );
    const userReset = await userSequlizer.getUserByCode(validResponse.code);
    if (!userReset)
      throw httpErrors.NotFound(
        "Reset Process is not saved in our database"
      );
    if (!(await userSequlizer.isVerified(userReset.user.id)))
      throw httpErrors.Unauthorized("Please verify your account first");
    const userWithNewPassword = await userSequlizer.resetPassword(userReset.user.id,validResponse.password);
    return res.json({
      status: true,
      message: "Password has been changed",
      data: {
        user: {
          id: userWithNewPassword.id,
          userName: userWithNewPassword.name,
          userEmail: userWithNewPassword.email,
        },
      },
    });
  } catch (error) {
    if (error.isJoi === true) error.status = 400;
    next(error);
  }
}
//----------------------------refresh token-------------------
module.exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw httpErrors.BadRequest("Refresh token is required");
    const userId = await verifyRefreshToken(refreshToken);
    const accessToken = await generateAccessToken(userId);
    const newRefreshToken = await generateRefreshToken(userId);
    return res.json({
      status: true,
      message: "Here are new refresh token and access token",
      data: {
        accessToken: accessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    next(error);
  }

  res.json({ name: "Refresh" });
};
module.exports.logout = async (req, res, next) => {
  res.json({ name: "Logout" });
};

//--------------------------facebook login ---------------------------
module.exports.facebookLogin = async (req, res, next) => {
  passport.authenticate(
    "facebook",
    { session: false, scope: "email" },
    (err, user, info) => {
      // Decide what to do on authentication
      if (err || !user) {
        return res.json({
          status: false,
          message: info,
          data: null,
        });
      }
      req.login(user, { session: false }, async (err) => {
        if (err) {
          res.status(400).send({ err });
        }
        const accessToken = await generateAccessToken(user.id);
        const refreshToken = await generateRefreshToken(user.id);
        res.redirect(process.env.WEB_URL + "/api/user/token/" + accessToken + "/" + refreshToken);
      });
    }
  )(req, res, next);
};

//--------------------------- google login-----------------------
module.exports.googleLogin = async (req, res, next) => {
  passport.authenticate(
    "google",
    { session: false, scope: "email" },
    (err, user, info) => {
      // Decide what to do on authentication
      if (err || !user) {
        return res.json({
          status: false,
          message: info,
          data: null,
        });
      }
      req.login(user, { session: false }, async (err) => {
        if (err) {
          res.status(400).send({ err });
        }
        const accessToken = await generateAccessToken(user.id);
        const refreshToken = await generateRefreshToken(user.id);
        res.redirect(process.env.WEB_URL + "/api/user/token/" + accessToken + "/" + refreshToken);
      });
    }
  )(req, res, next);
};
