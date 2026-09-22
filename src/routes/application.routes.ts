import { Router } from 'express';
import {
  applyForJob,
  getMyApplications,
  getApplicantsForJob,
} from '../controllers/application.controller';
import { authenticateJwt } from '../middleware/auth';

const router = Router();

router.post('/', authenticateJwt, applyForJob);
router.get('/me', authenticateJwt, getMyApplications);
router.get('/job/:jobId', authenticateJwt, getApplicantsForJob);

export default router;