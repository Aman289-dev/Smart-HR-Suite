import express from 'express';
import { getAttendanceSummary, getLeaveUsage, getDashboardStats } from '../controllers/reportController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/dashboard-stats', getDashboardStats);
router.get('/attendance-summary', authorize('hr', 'admin', 'manager'), getAttendanceSummary);
router.get('/leave-usage', authorize('hr', 'admin', 'manager'), getLeaveUsage);

export default router;
