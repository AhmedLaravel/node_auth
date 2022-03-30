const mail = require("./mail_init.mailer");

module.exports.forgotEmail = async (userReset) => {
  mail.message.to = userReset.user.email;
  mail.message.subject = "Forgot Password";
  mail.message.html = `
  <center>
  <h1>Hello ${userReset.user.name}</h1>
  <br>
  <h3>Welcome to ${process.env.APP_NAME}, please copy the code: ${userReset.code} to Reset your Password</h3>
  </center>
  `;
  mail.transporter.sendMail(mail.message, (err, info) => {
    if (err) {
      console.log(err,"err");
    } else {
      console.log(true,"email");
    }
  });
};
