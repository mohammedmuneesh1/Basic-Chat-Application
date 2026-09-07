import { NextFunction, Request, Response } from "express";
import multer from "multer";
import ResponseHandler from "../../utils/Response-Error-Handler/responseHandler";

const storage = multer.memoryStorage();
type MulterUploadType = 'single' | 'array' | 'any' | 'fields' | 'none';

interface FieldConfig {
  name: string;     // The name of the input field
  maxCount: number; // Maximum files allowed for this field
}




const multerUploadMiddleware = (
  type: MulterUploadType = "single",
  fieldName: string | FieldConfig[] = "file",
  isOptional: boolean = true,
  maxCount?: number,
  maxSizeMB: number = 7 // maximum file size in MB
) => {
  const upload = multer({ storage });
  let middleware;

  switch (type) {
    case "single":
      middleware = upload.single(fieldName as string);
      break;
    case "array":
      middleware = upload.array(fieldName as string, maxCount);
      break;
    case "fields":
      if (!Array.isArray(fieldName)) {
        throw new Error(
          'For "fields" type, fieldName must be an array of { name, maxCount } objects'
        );
      }
      middleware = upload.fields(fieldName);
      break;
    case "any":
      middleware = upload.any();
      break;
    case "none":
      middleware = upload.none();
      break;
    default:
      middleware = upload.single(fieldName as string);
  }

  return (req: Request, res: Response, next: NextFunction) => {
    middleware(req, res, (err) => {
      if (err) {
        return ResponseHandler(res, 400, false, null, err.message ?? "Image Upload Failed (M)");
      }

      const maxSizeBytes = maxSizeMB * 1024 * 1024;

      const filesToCheck: any[] = [];

      if (type === "single" && req.file) {
        filesToCheck.push(req.file);
      } else if (type === "array" && Array.isArray(req.files)) {
        filesToCheck.push(...req.files);
      } else if (type === "fields" && req.files && typeof req.files === "object") {
        Object.values(req.files).forEach((arr: any) => filesToCheck.push(...arr));
      } else if (type === "any" && Array.isArray(req.files)) {
        filesToCheck.push(...req.files);
      }

      // Check file size
      for (const file of filesToCheck) {

        if (file.size > maxSizeBytes) {
          return ResponseHandler(
            res,
            400,
            false,
            null,
            `File "${file.originalname}" exceeds max size of ${maxSizeMB}MB.`
          );
        }
      }

      // Validate presence of files
      if (!isOptional &&  type === "single" && !req.file) {
        return ResponseHandler(res, 400, false, null, `File "${fieldName}" is required.`);
      }
      if (!isOptional &&  ["array", "any"].includes(type) && (!req.files || (Array.isArray(req.files) && req.files.length === 0))) {
        return ResponseHandler(res, 400, false, null, `Files "${fieldName}" are required.`);
      }
      if (!isOptional &&  type === "fields" && (!req.files || Object.keys(req.files).length === 0)) {
        return ResponseHandler(res, 400, false, null, `Files for the specified fields are required.`);
      }
      next();
    });
  };
};
export default multerUploadMiddleware;




//PHASE-1 CODE WITHOUT FIELDS OPTION 
// const multerUploadMiddleware = (type:MulterUploadType = 'single', fieldName = 'file', maxCount?: number) => {
//   const upload = multer({ storage });
//   let middleware;
//   switch(type) {
//     case 'single':
//       middleware = upload.single(fieldName);
//       break;
//     case 'array':
//       middleware = upload.array(fieldName, maxCount);
//       break;
//     case 'any':
//       middleware = upload.any();
//       break;
//     case 'none':
//       middleware = upload.none();
//       break;
//     default:
//       middleware = upload.single(fieldName);
//   }
//   // Wrap middleware to validate file presence
//   return (req: Request, res: Response, next: NextFunction) => {
//     middleware(req, res, (err) => {
//       if (err) {
//         return ResponseHandler(res,400,false,null,err.message ?? "Image Upload Failed (M) ");
//       }
//       // Validation for empty file
//       if (type === 'single' && !req.file) {
//         return ResponseHandler(res,400,false,null, `File "${fieldName}" is required.Image Upload Failed (M) `);
//       }
//       if ((type === 'array' || type === 'any') && (!req.files || (Array.isArray(req.files) && req.files.length === 0))) {
//         return ResponseHandler(res,400,false,null, `Files "${fieldName}" are required.Image Upload Failed (M) `);
//       }
//       next();
//     });
//   };
// };
// export default multerUploadMiddleware;
