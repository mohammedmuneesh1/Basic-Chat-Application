import { Request, Response, NextFunction } from "express";
import ResponseHandler from "../../utils/Response-Error-Handler/responseHandler";

export const checkApiKey = (req: Request, res: Response, next: NextFunction) => {
  const key = req.header("x-api-key");
  const internalKey = req.header("internal-api-key");

  if (!key || key !== process.env.X_API_KEY) {
    ResponseHandler(res,401,false,null, "Invalid or missing API key");
    return;
  }

  if (!internalKey || internalKey !== process.env.INTERNAL_API_KEY) {
        ResponseHandler(res,401,false,null, "Invalid or missing API key");
    return;
  }

  next();
};