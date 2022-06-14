import parseToken from "parse-bearer-token";
import { decode } from "./jwt";

async function authMiddleware(req, res, next) {
  const token = parseToken(req);
  if (!token) {
    req._data = null;
  }
  const data = await decode(token);
  req._data = data;
  next();
}

export { authMiddleware };
