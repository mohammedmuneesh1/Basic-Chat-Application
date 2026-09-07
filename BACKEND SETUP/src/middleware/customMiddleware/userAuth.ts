import { Request, Response, NextFunction, } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import ResponseHandler from "../../utils/Response-Error-Handler/responseHandler";

interface DecodedToken {
    userId?: string;
    email?: string;
  }



export const checkUserAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    //NOTE (IF SETTING TOKEN IN FRONTEND MANUALLY THEN )
    // const authHeader = req.header("Authorization");
    //NOTE: IF SETTING TOKEN BY RES.COOKIE() ,
    //  THEN YOU NEEDS WITHCREDENTAILS TRUE ON CORS AND ACCESS VALUE BY   const token = req.cookies.token; 

    // console.log('authHeader',authHeader);
    // console.log('autoCookiesByFrontend',autoCookiesByFrontend);
    const autoCookiesByFrontend = req.cookies.token;

    // if (!authHeader || !authHeader.startsWith("Bearer")) {
    //   console.log('wer are here')
    //    ResponseHandler(res, 401,false,null, "Authorization token is missing or invalid");
    //    return;
    // }

    if (!autoCookiesByFrontend) {
              res.clearCookie("token", {
             httpOnly: true,
             secure: process.env.NODE_ENV === "production",
             sameSite: "strict",
      });
      
       ResponseHandler(res, 401,false,null, "Authorization token is missing or invalid");
       return;
    }

    // const token = authHeader.split(" ")[1];

    const decodedToken = jwt.verify(autoCookiesByFrontend,process.env.JWT_SECRET as string) as JwtPayload;
    if(!decodedToken?.uId) throw new Error('Session Expired. Please relogin again.');
    (req as UserAuth).uId = decodedToken?.uId;

    next();
  } catch (error: any) {


        res.clearCookie("token", {
             httpOnly: true,
             secure: process.env.NODE_ENV === "production",
             sameSite: "strict",
      });
            if (error instanceof jwt.TokenExpiredError) {
                 console.error('Your JWt Token has been expired');

                 ResponseHandler(res, 401,false,null, "Your JWt Token has been expired");
                 return;
            }
            if (error instanceof jwt.JsonWebTokenError) {
                console.error('Invalid Token. Please request a new token');
                 ResponseHandler(res, 401,false,null, "Invalid Token. Please request a new token");
                 return;
            }
            ResponseHandler(res,401,false,null, error instanceof Error ? error.message : 'Invalid token');
            return;
  }
};



export interface UserAuth extends Request {
//   schoolId?: string;
//   sc?:string;
  uId?:string;
}





        // if(!decodedToken?.sc) throw new Error('Session Expired (Sc required). Please relogin again.');
    // (req as AdminAuth).schoolId = decodedToken?.sId;
    // (req as AdminAuth).sc = decodedToken?.sc;
    // (req as AdminAuth).uId = decodedToken?.uId;
    // (req as SuperAdmin).email = decodedToken?.email;

