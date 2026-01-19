import { Request, Response } from 'express';
import User from '../models/User';
import { generateToken } from '../utils/auth';
import { successResponse, errorResponse } from '../utils/ApiResponse';

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      return successResponse(res, {
        _id: user._id,
        email: user.email,
        token: generateToken(user._id.toString()),
      }, 'Login successful');
    } else {
      return errorResponse(res, 'Invalid email or password', 401);
    }
  } catch (error: any) {
    return errorResponse(res, error.message || 'Login failed');
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response) => {
    if (!req.user) {
        return errorResponse(res, 'Not authorized', 401);
    }
    return successResponse(res, {
        _id: req.user._id,
        email: req.user.email,
    }, 'User profile retrieved');
};
