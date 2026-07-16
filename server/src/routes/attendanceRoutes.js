import express from 'express';
import { clockIn, clockOut, getMyAttendance, getAttendance, getSummary, requestRegularization, approveRegularization, exportAttendance } from '../controllers/attendanceController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.post('/clock-in', clockIn);
router.post('/clock-out', clockOut);
router.get('/my', getMyAttendance);
router.get('/summary', getSummary);
router.get('/export', authorize('hr', 'admin', 'manager'), exportAttendance);
router.get('/', authorize('hr', 'admin', 'manager'), getAttendance);
router.post('/regularize/:id', requestRegularization);
router.patch('/regularize/:id', authorize('hr', 'admin'), approveRegularization);

export default router;
