import express from 'express';
import { loginUser, getMe } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rateLimiter';

const router = express.Router();

router.post('/login', authLimiter, loginUser);
router.get('/me', protect, getMe);

export default router;
