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

export const emailVerifiedPageContent = `<html>

<body>
    <div style="display:flex;align-items: center;justify-content: center;flex-direction:column">
        <div>
            <h2>Cont activat cu succes!</h2>
        </div>
        <div>Apăsați aici pentru a reveni la pagina de login: <a href='${config.urlFrontend}/login'>Log in</a></div>
    </div>
</body>

</html>`;

export default sendEmail;
