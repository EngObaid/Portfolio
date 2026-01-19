"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMessageStatus = exports.deleteMessage = exports.getMessages = exports.createMessage = void 0;
const Message_1 = __importDefault(require("../models/Message"));
const ApiResponse_1 = require("../utils/ApiResponse");
// @desc    Create new message
// @route   POST /api/messages
// @access  Public
const createMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        const newMessage = await Message_1.default.create({
            name,
            email,
            subject,
            message,
        });
        return (0, ApiResponse_1.successResponse)(res, newMessage, 'Message sent successfully', 201);
    }
    catch (error) {
        return (0, ApiResponse_1.errorResponse)(res, error.message || 'Failed to send message');
    }
};
exports.createMessage = createMessage;
// @desc    Get all messages
// @route   GET /api/messages
// @access  Private/Admin
const getMessages = async (req, res) => {
    try {
        const messages = await Message_1.default.find({}).sort({ createdAt: -1 });
        return (0, ApiResponse_1.successResponse)(res, messages, 'Messages retrieved successfully');
    }
    catch (error) {
        return (0, ApiResponse_1.errorResponse)(res, error.message || 'Failed to retrieve messages');
    }
};
exports.getMessages = getMessages;
// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private/Admin
const deleteMessage = async (req, res) => {
    try {
        const message = await Message_1.default.findById(req.params.id);
        if (message) {
            await message.deleteOne();
            return (0, ApiResponse_1.successResponse)(res, null, 'Message removed successfully');
        }
        else {
            return (0, ApiResponse_1.errorResponse)(res, 'Message not found', 404);
        }
    }
    catch (error) {
        return (0, ApiResponse_1.errorResponse)(res, error.message || 'Failed to remove message');
    }
};
exports.deleteMessage = deleteMessage;
// @desc    Update message status
// @route   PATCH /api/messages/:id
// @access  Private/Admin
const updateMessageStatus = async (req, res) => {
    try {
        const { read } = req.body;
        const message = await Message_1.default.findById(req.params.id);
        if (message) {
            message.read = read === undefined ? !message.read : read;
            const updatedMessage = await message.save();
            return (0, ApiResponse_1.successResponse)(res, updatedMessage, 'Message status updated');
        }
        else {
            return (0, ApiResponse_1.errorResponse)(res, 'Message not found', 404);
        }
    }
    catch (error) {
        return (0, ApiResponse_1.errorResponse)(res, error.message || 'Failed to update message');
    }
};
exports.updateMessageStatus = updateMessageStatus;
