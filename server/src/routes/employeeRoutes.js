import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAllEmployees, getEmployee, updateEmployee, updateStatus, uploadDocument, deleteDocument } from '../controllers/employeeController.js';
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
router.get('/', authorize('hr', 'admin', 'manager'), getAllEmployees);
router.get('/:id', getEmployee);
router.put('/:id', updateEmployee);
router.patch('/:id/status', authorize('hr', 'admin'), updateStatus);
router.post('/:id/documents', upload.single('file'), uploadDocument);
router.delete('/:id/documents/:docId', authorize('hr', 'admin'), deleteDocument);

export default router;
