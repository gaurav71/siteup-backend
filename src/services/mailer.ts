"use strict";
import nodemailer from "nodemailer";
import { config } from "../config/config";

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
  // let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: config.emailServer.host,
    port: config.emailServer.port,
    secure: config.emailServer.port === 465, // true for 465, false for other ports
    auth: {
      user: config.emailServer.user,
      pass: config.emailServer.key
    },
  });

  const { from, to, subject, body, html } = input

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from,
    to, 
    subject,
    text: body,
    html: html
  });

  console.log("Message sent: %s", info.messageId);

  // Preview only available when sending through an Ethereal account
  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
