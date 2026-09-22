import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes';
import assessmentRoutes from './routes/assessment.routes';
import applicationRoutes from './routes/application.routes';
import devRoutes from './routes/dev.routes';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    server: 'Aryan core backend',
  });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/assessments', assessmentRoutes);
app.use('/api/v1/applications', applicationRoutes);
app.use('/api/v1/dev', devRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});