const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `Janish Nehyan ${process.env.EMAIL_FROM}`;
  }
  newTransport() {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "nehyanjanish@gmail.com",
        pass: process.env.EMAIL_PASSWORD,
      },
      port: 465,
      secure: true,
    });
  }
  async send(template, subject) {
    //1) render HTML based on pug
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });
    // 2) define Email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      html,
      text: htmlToText.fromString(html),
    };
    // 3) create a trasport and send
    await this.newTransport().sendMail(mailOptions); //sendMail is build in function
  }
  async sendWelcome() {
    await this.send("welcome", "welcome to natours family");
  }

  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "Your password reset token (valid for 10 minutes)"
    );
  }
};
