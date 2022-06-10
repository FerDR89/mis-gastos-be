import * as yup from "yup";

const schemaValidateEmail = yup
  .string()
  .email()
  .lowercase()
  .trim()
  .required()
  .strict(true);
const schemaValidateCode = yup.number().required().strict(true);

async function validateEmail(email: string) {
  return await schemaValidateEmail.validate(email).catch(function (err) {
    console.log(err);
  });
}

async function validateCode(code: number) {
  return await schemaValidateCode.validate(code).catch(function (err) {
    console.log(err);
  });
}

export { validateEmail, validateCode };
