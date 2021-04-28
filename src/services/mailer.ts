"use strict";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

// async..await is not allowed in global scope, must use a wrapper
export const sendMail = async(input: {
  from: string;
  to: string;
  subject: string;
  body?: string;
  html?: string;
}) => {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  const { from, to, subject, body, html } = input

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from, // sender address
    to, // list of receivers
    subject, // Subject line
    text: body, // plain text body
    html: html
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
