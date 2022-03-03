const mail = require("./mail_init.mailer");

module.exports.verificationEmail = async (user) => {
  mail.message.to = user.email;
  mail.message.subject = "User verification";
  mail.message.html = `
  <center>
  <h1>hello ${user.name}</h1>
  <br>
  <h3>Welcome to ${process.env.APP_NAME}, please copy the code: ${user.verificationCode} to confirm your verification</h3>
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
