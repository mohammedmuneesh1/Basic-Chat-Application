import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { StringValue } from "ms"; // ✅ This is the key
import logger from "../../libs/winstonLogger";

const generateJwtFn = (
  payload: object,
  expiresIn: string = "7d"
): string => {
  const secret: Secret = process.env.JWT_SECRET as Secret;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  logger.debug(`✅ JWT_SECRET is defined in environment variables ${expiresIn}`);
  
  const options: SignOptions = {
    expiresIn: expiresIn as StringValue, // ✅ Cast to correct type
  };
 // ✅ Explicitly typed
  const token = jwt.sign(payload, secret, options);
  return token;
};
export default generateJwtFn;
