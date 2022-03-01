const nodemailer = require("nodemailer");

//-----------------------initializing the nodemailer----------------
module.exports.transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});


//------------------------------------initializing the message content-------------------
module.exports.message = {
  from: `"${process.env.MAIL_FROM_NAME}"  ${process.env.MAIL_FROM}`,
};
