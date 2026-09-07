import { NextFunction, Request, Response } from "express";
import sharp from "sharp";
import ResponseHandler from "../../utils/Response-Error-Handler/responseHandler";


// 🔍 What happens in req.files:

// req.files becomes an object structured like this:

// {
//     avatar: [ { /* fileObject for avatar */ } ],
//     gallery: [
//         { /* fileObject for gallery #1 */ },
//         { /* fileObject for gallery #2 */ },
//         // ...up to 5 files
//     ]
// }


                        //image buffer file 
//                         [
//     { originalname: 'pic1.jpg', mimetype: 'image/jpeg', size: 1MB, buffer: Buffer(...) },
//     { originalname: 'pic2.png', mimetype: 'image/png', size: 2MB, buffer: Buffer(...) },
//     { originalname: 'video.mp4', mimetype: 'video/mp4', size: 10MB, buffer: Buffer(...) },
//     { originalname: 'pic3.jpeg', mimetype: 'image/jpeg', size: 3MB, buffer: Buffer(...) },
//     { originalname: 'file.docx', mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: 1MB, buffer: Buffer(...) }
// ]

//THIS WILL BE THE FORMAT. DO IT OR FUCKING DIE 



const imageCompressor = (maxSizeMB = 5) => {
    return async (req: Request, res: Response, next: NextFunction):Promise<void> => {
        try {
            if (req.file) {
                req.file = await compressIfImage(req.file, maxSizeMB);
            } else if (Array.isArray(req.files)) {
                req.files = await Promise.all(req.files.map(file => compressIfImage(file, maxSizeMB)));
            } else if (typeof req.files === 'object' && !Array.isArray(req.files)) {
                const fields = Object.keys(req.files);
                for (const field of fields) {
                    req.files[field] = await Promise.all(
                        req.files[field].map((file: any) => compressIfImage(file, maxSizeMB))
                    );
                }
            }
            next();
        } catch (error: any) {
            console.error('Image compression error:', error.message);
               throw new Error('Image compression error: ' + error.message);
        }
    };
};

export default imageCompressor;



const compressIfImage = async (file: any, maxSizeMB: number) => {
    console.log('file size before compression:', file.size);

    const fileSizeMB = file.size / (1024 * 1024);

    if (fileSizeMB > maxSizeMB) {
        throw new Error(
            `Skipping compression: ${file.originalname} exceeds max allowed size of ${maxSizeMB}MB (actual: ${fileSizeMB.toFixed(2)}MB)`
        );
    }

    // Only create Sharp instance for image files
    if (!file.mimetype.startsWith('image/')) {
        // Non-image files → skip compression
        return file;
    }

    let sharpProcessor = sharp(file.buffer).resize(800);

    if (file.mimetype === 'image/png') {
        sharpProcessor = sharpProcessor.png({ quality: 80 });  // Keeps PNG
    } else if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
        sharpProcessor = sharpProcessor.jpeg({ quality: 80 });  // JPEG
    } else {
        // Convert other image types to WebP
        sharpProcessor = sharpProcessor.webp({ quality: 80 });
        file.mimetype = 'image/webp';
    }

    const compressedBuffer = await sharpProcessor.toBuffer();
    file.buffer = compressedBuffer;
    file.size = compressedBuffer.length;

    console.log('file size after compression:', compressedBuffer.length);

    return file;
};




// router.post(
//     '/upload-single',
//     upload.single('file'),
//     imageCompressor,
//     uploadToCloudinary
// );

// upload.any()


// router.post(
//     '/upload-dynamic',
//     upload.any(),        // Accept any number of files from any field
//     imageCompressor,     // Compress image files, skip others
//     uploadToCloudinary   // Upload all files (compressed images + others)
// );