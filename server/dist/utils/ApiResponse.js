"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.successResponse = exports.sendResponse = void 0;
const sendResponse = (res, statusCode, status, message, data, errors) => {
    return res.status(statusCode).json({
        status,
        message,
        data,
        errors,
    });
};
exports.sendResponse = sendResponse;
const successResponse = (res, data, message = 'Success', statusCode = 200) => {
    return (0, exports.sendResponse)(res, statusCode, 'success', message, data);
};
exports.successResponse = successResponse;
const errorResponse = (res, message, statusCode = 500, errors) => {
    return (0, exports.sendResponse)(res, statusCode, 'error', message, undefined, errors);
};
exports.errorResponse = errorResponse;
