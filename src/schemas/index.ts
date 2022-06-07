import * as yup from 'yup';

const schemaValidateEmail = yup.object().shape({
    email: yup.string().email().lowercase().trim().required().strict(),
});

async function validateEmail(email) {
    return await schemaValidateEmail.validate(email).catch(function (err) {
        console.log(err);
    })
}

export { validateEmail }