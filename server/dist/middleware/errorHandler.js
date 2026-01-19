"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const ApiResponse_1 = require("../utils/ApiResponse");
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : (res.statusCode || 500);
    console.error(`[Error] ${err.message}`);
    if (process.env.NODE_ENV !== 'production') {
        console.error(err.stack);
    }
    return (0, ApiResponse_1.errorResponse)(res, err.message || 'Internal Server Error', statusCode, process.env.NODE_ENV === 'production' ? undefined : [{ stack: err.stack }]);
};
exports.errorHandler = errorHandler;
