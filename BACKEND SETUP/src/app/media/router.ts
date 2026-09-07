import express from 'express'
import imageCompressor from '../../middleware/builtInMiddleware/imageCompressionMulter';
import uploadToCloudinary from '../../middleware/customMiddleware/AWS-CLOUDINARY/uploadToCloudinary';
import { trailFn } from './controller';
import multerUploadMiddleware from '../../middleware/builtInMiddleware/multerMiddleware';
import tryCatch from '../../middleware/customMiddleware/tryCatch';


export const router = express.Router();


router.route('/test-upload').post(multerUploadMiddleware('single','image'),imageCompressor(),uploadToCloudinary(),tryCatch(trailFn));





// router.post(
//     '/upload-single',
//     upload.single('file'),
//     imageCompressor,
//     uploadToCloudinary
// );