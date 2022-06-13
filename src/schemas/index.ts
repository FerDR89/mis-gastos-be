import * as yup from "yup";

const schemaValidateEmail = yup
  .string()
  .email()
  .lowercase()
  .trim()
  .required()
  .strict(true);

async function validateEmail(email: string): Promise<string | void> {
  return await schemaValidateEmail.validate(email).catch(function (err) {
    console.log(err);
  });
}

const schemaValidateNumber = yup.number().positive().required().strict(true);

async function validateNumber(code: number): Promise<number | void> {
  return await schemaValidateNumber.validate(code).catch(function (err) {
    console.log(err);
  });
}

const schemaValidateString = yup.string().required().strict(true);

async function validateString(string: string): Promise<string | void> {
  return await schemaValidateString.validate(string).catch(function (err) {
    console.log(err);
  });
}

export { validateEmail, validateNumber, validateString };
