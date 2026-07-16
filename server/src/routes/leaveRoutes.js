import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { applyLeave, getMyLeaves, getAllLeaves, managerApprove, hrApprove, getCalendar, getBalance, exportLeaves } from '../controllers/leaveController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.resolve(__dirname, '../../uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

const router = express.Router();

router.use(protect);
router.post('/', upload.single('attachment'), applyLeave);
router.get('/my', getMyLeaves);
router.get('/calendar', getCalendar);
router.get('/balance/:userId', getBalance);
router.get('/export', authorize('hr', 'admin', 'manager'), exportLeaves);
router.get('/', authorize('hr', 'admin', 'manager'), getAllLeaves);
router.patch('/:id/manager-approve', authorize('manager', 'hr', 'admin'), managerApprove);
router.patch('/:id/hr-approve', authorize('hr', 'admin'), hrApprove);

export default router;
