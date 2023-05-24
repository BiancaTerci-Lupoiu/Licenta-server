import sendGrid from "@sendgrid/mail";
import { config } from "../../config";
import { EmailOptions } from "./interfaces";

sendGrid.setApiKey(config.sendgridApiKey);

const sendEmail = async (options: EmailOptions) => {
  const message = {
    from: `${config.fromName} <${config.fromEmail}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  try {
    const info = await sendGrid.send(message);
    console.log("Message sent: %s", info);
    return info;
  } catch (err) {
    return null;
  }
};

export const emailVerifiedPageContent = `<html><body><div>Account activated successfully! <br> Click here to return to the login page: <a href='${config.urlFrontend}/login'>Log in</a></div></body></html>`;

export default sendEmail;
