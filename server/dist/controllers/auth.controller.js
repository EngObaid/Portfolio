"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.loginUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../utils/auth");
const ApiResponse_1 = require("../utils/ApiResponse");
// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            return (0, ApiResponse_1.successResponse)(res, {
                _id: user._id,
                email: user.email,
                token: (0, auth_1.generateToken)(user._id.toString()),
            }, 'Login successful');
        }
        else {
            return (0, ApiResponse_1.errorResponse)(res, 'Invalid email or password', 401);
        }
    }
    catch (error) {
        return (0, ApiResponse_1.errorResponse)(res, error.message || 'Login failed');
    }
};
exports.loginUser = loginUser;
// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    if (!req.user) {
        return (0, ApiResponse_1.errorResponse)(res, 'Not authorized', 401);
    }
    return (0, ApiResponse_1.successResponse)(res, {
        _id: req.user._id,
        email: req.user.email,
    }, 'User profile retrieved');
};
exports.getMe = getMe;
