import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthenticatedRequest } from '../middleware/auth';

export const getAssessments = async (
  _req: Request,
  res: Response
) => {
  const assessments = await prisma.assessment.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return res.json({
    success: true,
    assessments,
  });
};

export const getAssessmentById = async (
  req: Request,
  res: Response
) => {
  const id = String(req.params.id);

  const assessment = await prisma.assessment.findUnique({
    where: { id },
  });

  if (!assessment) {
    return res.status(404).json({
      success: false,
      message: 'Assessment not found',
    });
  }

  return res.json({
    success: true,
    assessment,
  });
};

export const submitAssessment = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user?.userId;
  const assessmentId = String(req.params.id);

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated',
    });
  }

  const { answers, score, maxScore } = req.body;

  if (answers === undefined) {
    return res.status(400).json({
      success: false,
      message: 'answers are required',
    });
  }

  const submission =
    await prisma.assessmentSubmission.upsert({
      where: {
        assessmentId_userId: {
          assessmentId,
          userId: String(userId),
        },
      },
      update: {
        answers,
        score,
        maxScore,
        submittedAt: new Date(),
      },
      create: {
        assessmentId,
        userId: String(userId),
        answers,
        score,
        maxScore,
      },
    });

  return res.status(201).json({
    success: true,
    submission,
  });
};

export const getMyAssessmentSubmissions = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated',
    });
  }

  const submissions =
    await prisma.assessmentSubmission.findMany({
      where: {
        userId: String(userId),
      },
      include: {
        assessment: true,
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });

  return res.json({
    success: true,
    submissions,
  });
};