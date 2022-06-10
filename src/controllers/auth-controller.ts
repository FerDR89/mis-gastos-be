import { Auth } from "../models/auth";
import { User } from "../models/user";
import { addMinutes } from "date-fns";
import sendEmailCode from "../lib/sengrid";

const findOrCreateAuth = async (email: string): Promise<Auth> => {
  try {
    const auth = await Auth.findByEmail(email);

    if (auth) {
      return auth;
    } else {
      const newUser = await User.createNewUser({ email });
      const userId = newUser.id;
      const newAuth = await Auth.createNewAuth({
        email,
        userId,
        code: 0,
        expires: new Date(),
      });
      return newAuth;
    }
  } catch (error) {
    console.log(error);
  }
};

const sendCodeByEmail = async (email: string) => {
  try {
    const auth = await findOrCreateAuth(email);
    if (!auth) {
      return false;
    } else {
      const randomNumber = Math.floor(Math.random() * (10000 - 1000) + 1000);
      const dateNow = new Date();
      const fiftyMinutesFromDateNow = addMinutes(dateNow, 15);
      auth.data.code = randomNumber;
      auth.data.expires = fiftyMinutesFromDateNow;
      await auth.push();
      await sendEmailCode(email, auth.data.code);
      return true;
    }
  } catch (error) {
    console.log(error);
  }
};

export { sendCodeByEmail };
