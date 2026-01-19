"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const message_controller_1 = require("../controllers/message.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const rateLimiter_1 = require("../middleware/rateLimiter");
const router = express_1.default.Router();
router.post('/', rateLimiter_1.strictLimiter, message_controller_1.createMessage);
router.get('/', auth_middleware_1.protect, message_controller_1.getMessages);
router.route('/:id')
    .patch(auth_middleware_1.protect, message_controller_1.updateMessageStatus)
    .delete(auth_middleware_1.protect, message_controller_1.deleteMessage);
exports.default = router;
