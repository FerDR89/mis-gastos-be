import * as jwt from "jsonwebtoken";

const createToken = (userId: string) => {
  const token = jwt.sign({ userId }, process.env.SECRET_WORD);
  return token;
};

const decode = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.SECRET_WORD);
    return decoded;
  } catch (e) {
    console.error("Token incorrecto");
    return null;
  }
};

export { createToken, decode };
