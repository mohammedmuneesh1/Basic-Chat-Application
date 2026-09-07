import { NextFunction, Request, Response } from "express";
import UserModel from "../../user/models/user.schema";
import ResponseHandler from "../../../utils/Response-Error-Handler/responseHandler";

const checkUserExists = async (req:Request, res:Response, next:NextFunction) => {
    const { email } = req.body;
  const user = await UserModel.findOne({ email });
  if (user) {
     ResponseHandler(res, 409, false, null, 'User already registered.');
  }
  else{
      next();
  }
};
export default checkUserExists;

