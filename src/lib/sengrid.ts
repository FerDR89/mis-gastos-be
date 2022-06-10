const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function sendEmailCode(email: string, code: number) {
  const msg = {
    to: email,
    from: "ferdr89dev@gmail.com",
    subject: `Te enviamos tu código de ingreso a nuestra plataforma`,
    text: `Tu código de ingreso es ${code}`,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(error);
    if (error.response) {
      console.error(error.response.body);
    }
  }
}
