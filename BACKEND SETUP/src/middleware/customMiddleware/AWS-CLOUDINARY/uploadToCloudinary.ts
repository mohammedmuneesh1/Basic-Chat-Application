import { NextFunction, Request, Response } from 'express';
import streamifier from 'streamifier';
import cloudinary from '../../../configs/cloudinaryConfigure';

// Middleware Factory: Accept dynamic folder name
const uploadToCloudinary = (folderName="test") => {
    return async (req: Request, res: Response, next: NextFunction):Promise<void> => {
        let files: any[] = [];
        console.log('req.files value ', req.file,req.files);

        if (req.file) {
            files = [req.file];
        } else if (Array.isArray(req.files)) {
            files = req.files;
        } else if (typeof req.files === 'object' && !Array.isArray(req.files)) {
            files = Object.values(req.files).flat();
        }

        if (files.length === 0) return next();
        try {
            const uploadedFiles = await Promise.all(
                files.map(file => {
                    return new Promise<{ public_id: string; url: string }>((resolve, reject) => {
                        const uploadStream = cloudinary.uploader.upload_stream(
                            {
                                folder: folderName,  // Dynamically set folder
                            },
                            (error, result) => {
                                if (error) return reject(error);
                                resolve({ public_id: result!.public_id, url: result!.secure_url });
                            }
                        );

                        streamifier.createReadStream(file.buffer).pipe(uploadStream);
                    });
                })
            );
            req.body.cloudinaryFiles = uploadedFiles;
            next();
        } catch (error) {
            console.error('Cloudinary upload error:', error);
           throw new Error ('Image upload to c failed.');
        }
    };
};

export default uploadToCloudinary;
