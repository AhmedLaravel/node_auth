const validator = require("validator");

//----------------------------registeration validation ------------------
module.exports.userValidation = (data) => {
  if (!validator.isEmail(data.email)) {
    return{
      status: false,
      message: "Please Enter a Valid Email",
      data: null,
    };
  }
  if (!data.name || validator.isEmpty(data.name)) {
    return{
      status: false,
      message: "Name is required",
      data: null,
    };
  }
  if (!data.email || validator.isEmpty(data.email)) {
    return{
      status: false,
      message: "Email is required",
      data: null,
    };
  }
  if (!data.password || validator.isEmpty(data.password)) {
    return{
      status: false,
      message: "Password is required",
      data: null,
    };
  }
};

//------------------------------user verification validation----------------------
module.exports.verificationValidation =  (data) => {
  //user id check validation
  if (!data.id || validator.isEmpty(data.id) ) {
    return{
      status: false,
      message: "User id is required",
      data: null,
    };
  }

  //verification code  check validation
  if (!data.verification_code || validator.isEmpty(data.verification_code) ) {
    return{
      status: false,
      message: "Verification code is required",
      data: null,
    };
  }
}
//------------------------------user verification validation----------------------
