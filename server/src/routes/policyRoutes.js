import express from 'express';
import { getPolicy, createPolicy, applyPolicy } from '../controllers/policyController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/', getPolicy);
router.post('/', authorize('hr', 'admin'), createPolicy);
router.post('/:id/apply', authorize('hr', 'admin'), applyPolicy);

export default router;
