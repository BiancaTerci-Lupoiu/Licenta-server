import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { config } from "../../config";
import { EmailOptions } from "./interfaces";

const sendEmail = async (options: EmailOptions) => {
  const transporter: nodemailer.Transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    auth: {
      user: config.smtpEmail,
      pass: config.smtpPassword,
    },
  } as SMTPTransport.Options);

  const message = {
    from: `${config.fromName} <${config.fromEmail}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  try {
    const info = await transporter.sendMail(message);
    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (err) {
    return null;
  }
};

//export default sendEmail;
