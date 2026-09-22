import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthenticatedRequest } from '../middleware/auth';

export const applyForJob = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;
    const { jobId, resumeUrl, coverNote } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: 'jobId is required',
      });
    }

    const student = await prisma.studentProfile.findUnique({
      where: {
        userId: String(userId),
      },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found',
      });
    }

    const job = await prisma.jobPosting.findUnique({
      where: {
        id: String(jobId),
      },
    });

    if (!job || job.status !== 'OPEN') {
      return res.status(404).json({
        success: false,
        message: 'Job is not available',
      });
    }

    const application = await prisma.application.create({
      data: {
        studentId: student.id,
        jobId: String(jobId),
        resumeUrl: resumeUrl || null,
        coverNote: coverNote || null,
      },
    });

    return res.status(201).json({
      success: true,
      application,
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'Already applied for this job',
      });
    }

    console.error(error);

    return res.status(500).json({
      success: false,
      message: 'Failed to apply for job',
    });
  }
};

export const getMyApplications = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    const applications = await prisma.application.findMany({
      where: {
        student: {
          userId: String(userId),
        },
      },
      include: {
        job: {
          include: {
            company: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch applications',
    });
  }
};

export const getApplicantsForJob = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const jobId = String(req.params.jobId);

    const applications = await prisma.application.findMany({
      where: {
        jobId,
      },
      include: {
        student: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch applicants',
    });
  }
};