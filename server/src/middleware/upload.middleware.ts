import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';
import fs from 'fs';
import { errorResponse } from '../utils/ApiResponse';

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync('uploads/')) {
        fs.mkdirSync('uploads/');
    }
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Sanitize original name and add unique suffix
    const sanitizedName = file.originalname.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
    const uniqueSuffix = crypto.randomBytes(8).toString('hex');
    const ext = path.extname(sanitizedName);
    const name = path.basename(sanitizedName, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  },
});

// Check file type
function checkFileType(file: Express.Multer.File, cb: multer.FileFilterCallback) {
  const filetypes = /jpeg|jpg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Images Only (jpeg, jpg, png, webp)!'));
  }
}

export const upload = multer({
  storage,
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 10,
  },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Middleware to validate image dimensions AFTER upload
export const validateDimensions = async (req: any, res: any, next: any) => {
    if (!req.file && (!req.files || req.files.length === 0)) return next();

    try {
        let files: Express.Multer.File[] = [];
        if (req.file) {
            files = [req.file];
        } else if (req.files) {
            if (Array.isArray(req.files)) {
                files = req.files;
            } else {
                // req.files is an object (dictionary)
                files = Object.values(req.files).flat() as any as Express.Multer.File[];
            }
        }
        
        for (const file of files) {
            const metadata = await sharp(file.path).metadata();
            
            // Premium requirement: Cover images must be high res
            if (file.fieldname === 'coverImage' || file.fieldname === 'image') {
                if ((metadata.width || 0) < 800) {
                    // Remove file if invalid
                    fs.unlinkSync(file.path);
                    return errorResponse(res, `Image too small. Cover images must be at least 800px wide.`, 400);
                }
            }
        }
        next();
    } catch (error: any) {
        console.error("Dimension validation error:", error);
        return errorResponse(res, "Failed to validate image dimensions", 400);
    }
};

// Wrapper for multer to handle errors
export const handleUploadError = (err: any, req: any, res: any, next: any) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return errorResponse(res, 'File too large. Max size is 5MB.', 400);
        }
        return errorResponse(res, err.message, 400);
    } else if (err) {
        return errorResponse(res, err.message, 400);
    }
    next();
};
