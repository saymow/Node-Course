import sgMail from "@sendgrid/mail";

const sendGridApiKey = process.env.SENDGRID_API_KEY as string;

sgMail.setApiKey(sendGridApiKey);

interface WecolmeEmailProps {
  name: string;
  email: string;
}

const sendWelcomeEmail = async ({ email, name }: WecolmeEmailProps) => {
  return await sgMail.send({
    from: "gustavo_alves2010@yahoo.com.br",
    to: email,
    subject: "Thanks for joining in.",
    html: `<p>Thanks for joining our team, <strong>${name}</strong>. <br>Let me know how you get along with the app!</p>`,
  });
};

const sendFarewellEmail = async ({ email, name }: WecolmeEmailProps) => {
  return await sgMail.send({
    from: "gustavo_alves2010@yahoo.com.br",
    to: email,
    subject: ":( Could you tell me the reason?",
    html: `<p>Could you tell our team why now? ${name}</p>`,
  });
};

export { sendWelcomeEmail, sendFarewellEmail };
