import { Router } from 'express';
import { createTestData } from '../controllers/dev.controller';

const router = Router();

router.post('/seed-test-data', createTestData);

export default router;