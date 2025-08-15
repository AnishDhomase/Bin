import { Verification_Email_Template } from "./emailTemplates.js";

import nodemailer from "nodemailer";
import { getMySecretPass } from "./getMySecretPass.js";

// Sender Info
export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "namanmeravi0@gmail.com ",
    pass: getMySecretPass(),
  },
});

export const sendVerificationCode = async (name, email, verificationCode) => {
  try {
    const response = await transporter.sendMail({
      from: '"Bin" <anishdhomase@gmail.com>',
      to: email,
      subject: "Verify your email",
      text: `Your verification code is: ${verificationCode}`,
      html: Verification_Email_Template.replace(
        "{verificationCode}",
        verificationCode
      ).replace("{username}", formatName(name) || "user"), // HTML body
    });
  } catch (error) {
    console.log("Problem occured while sending email", error);
  }
};

function formatName(name) {
  return (
    name.trim().charAt(0).toUpperCase() + name.trim().slice(1).toLowerCase()
  );
}
