import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', protect, authorize('hr', 'admin'), register);
router.post('/login', login);
router.get('/me', protect, getMe);

export default router;
