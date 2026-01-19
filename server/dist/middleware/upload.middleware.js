"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUploadError = exports.validateDimensions = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const sharp_1 = __importDefault(require("sharp"));
const fs_1 = __importDefault(require("fs"));
const ApiResponse_1 = require("../utils/ApiResponse");
// Set storage engine
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        if (!fs_1.default.existsSync('uploads/')) {
            fs_1.default.mkdirSync('uploads/');
        }
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Sanitize original name and add unique suffix
        const sanitizedName = file.originalname.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
        const uniqueSuffix = crypto_1.default.randomBytes(8).toString('hex');
        const ext = path_1.default.extname(sanitizedName);
        const name = path_1.default.basename(sanitizedName, ext);
        cb(null, `${name}-${uniqueSuffix}${ext}`);
    },
});
// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    }
    else {
        cb(new Error('Images Only (jpeg, jpg, png, webp)!'));
    }
}
exports.upload = (0, multer_1.default)({
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
const validateDimensions = async (req, res, next) => {
    if (!req.file && (!req.files || req.files.length === 0))
        return next();
    try {
        const files = req.file ? [req.file] : req.files;
        for (const file of files) {
            const metadata = await (0, sharp_1.default)(file.path).metadata();
            // Premium requirement: Cover images must be high res
            if (file.fieldname === 'coverImage' || file.fieldname === 'image') {
                if ((metadata.width || 0) < 800) {
                    // Remove file if invalid
                    fs_1.default.unlinkSync(file.path);
                    return (0, ApiResponse_1.errorResponse)(res, `Image too small. Cover images must be at least 800px wide.`, 400);
                }
            }
        }
        next();
    }
    catch (error) {
        console.error("Dimension validation error:", error);
        return (0, ApiResponse_1.errorResponse)(res, "Failed to validate image dimensions", 400);
    }
};
exports.validateDimensions = validateDimensions;
// Wrapper for multer to handle errors
const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer_1.default.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return (0, ApiResponse_1.errorResponse)(res, 'File too large. Max size is 5MB.', 400);
        }
        return (0, ApiResponse_1.errorResponse)(res, err.message, 400);
    }
    else if (err) {
        return (0, ApiResponse_1.errorResponse)(res, err.message, 400);
    }
    next();
};
exports.handleUploadError = handleUploadError;
