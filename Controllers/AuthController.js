const httpErrors = require("http-errors");
const bcrypt = require("bcrypt");
const userRequest = require("../Request/Authentication/user.request");
const userSequlizer = require("../Sequelizer/user.squelizer");
const verificationEmail = require("../Mailer/verification_email");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../Helpers/jwt.helper");
const validation = require("../Request/Authentication/login.request");
const { verifyToken } = require("../Middlewares/auh.middleware");

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
    console.log;
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
      userName: verifiedUser.name,
      userEmail: verifiedUser.email,
    },
  });
};
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
module.exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if(!refreshToken) throw httpErrors.BadRequest("Refresh token is required");
    const userId = await verifyRefreshToken(refreshToken);
    const accessToken = await generateAccessToken(userId);
    const newRefreshToken = await generateRefreshToken(userId);
    return res.json({
      status: true,
      message: "Here are new refresh token and access token",
      data: {
        accessToken: accessToken,
        refreshToken: refreshToken,
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
