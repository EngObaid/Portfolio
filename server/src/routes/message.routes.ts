import express from 'express';
import { createMessage, getMessages, deleteMessage, updateMessageStatus } from '../controllers/message.controller';
import { protect } from '../middleware/auth.middleware';
import { strictLimiter } from '../middleware/rateLimiter';

const router = express.Router();

router.post('/', strictLimiter, createMessage);
router.get('/', protect, getMessages);
router.route('/:id')
  .patch(protect, updateMessageStatus)
  .delete(protect, deleteMessage);

export default router;
