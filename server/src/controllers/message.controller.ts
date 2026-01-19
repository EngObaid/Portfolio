import { Request, Response } from 'express';
import Message from '../models/Message';
import { successResponse, errorResponse } from '../utils/ApiResponse';

// @desc    Create new message
// @route   POST /api/messages
// @access  Public
export const createMessage = async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;

    const newMessage = await Message.create({
      name,
      email,
      subject,
      message,
    });

    return successResponse(res, newMessage, 'Message sent successfully', 201);
  } catch (error: any) {
    return errorResponse(res, error.message || 'Failed to send message');
  }
};

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private/Admin
export const getMessages = async (req: Request, res: Response) => {
  try {
    const messages = await Message.find({}).sort({ createdAt: -1 });
    return successResponse(res, messages, 'Messages retrieved successfully');
  } catch (error: any) {
    return errorResponse(res, error.message || 'Failed to retrieve messages');
  }
};

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private/Admin
export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const message = await Message.findById(req.params.id);

    if (message) {
      await message.deleteOne();
      return successResponse(res, null, 'Message removed successfully');
    } else {
      return errorResponse(res, 'Message not found', 404);
    }
  } catch (error: any) {
    return errorResponse(res, error.message || 'Failed to remove message');
  }
};

// @desc    Update message status
// @route   PATCH /api/messages/:id
// @access  Private/Admin
export const updateMessageStatus = async (req: Request, res: Response) => {
  try {
    const { read } = req.body;
    const message = await Message.findById(req.params.id);

    if (message) {
      message.read = read === undefined ? !message.read : read;
      const updatedMessage = await message.save();
      return successResponse(res, updatedMessage, 'Message status updated');
    } else {
      return errorResponse(res, 'Message not found', 404);
    }
  } catch (error: any) {
    return errorResponse(res, error.message || 'Failed to update message');
  }
};
