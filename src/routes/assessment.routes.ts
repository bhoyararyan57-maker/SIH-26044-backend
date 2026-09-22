import { Router } from 'express';
import {
  getAssessments,
  getAssessmentById,
  submitAssessment,
  getMyAssessmentSubmissions,
} from '../controllers/assessment.controller';
import { authenticateJwt } from '../middleware/auth';

const router = Router();

router.get(
  '/submissions/me',
  authenticateJwt,
  getMyAssessmentSubmissions
);

router.get('/', authenticateJwt, getAssessments);

router.get('/:id', authenticateJwt, getAssessmentById);

router.post('/:id/submit', authenticateJwt, submitAssessment);

export default router;