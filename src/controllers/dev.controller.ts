import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';
import { prisma } from '../lib/prisma';

export const createTestData = async (
  _req: Request,
  res: Response
) => {
  try {
    const passwordHash = await bcrypt.hash(
      'password123',
      10
    );

    const studentUser = await prisma.user.upsert({
      where: {
        email: 'student@test.com',
      },
      update: {
        password: passwordHash,
        role: Role.STUDENT,
      },
      create: {
        email: 'student@test.com',
        password: passwordHash,
        role: Role.STUDENT,
      },
    });

    const studentProfile =
      await prisma.studentProfile.upsert({
        where: {
          userId: studentUser.id,
        },
        update: {
          fullName: 'Test Student',
          major: 'Computer Science',
          gpa: 3.8,
          skills: [
            'Node.js',
            'Express',
            'TypeScript',
          ],
          targetIndustry: 'Technology',
        },
        create: {
          userId: studentUser.id,
          fullName: 'Test Student',
          major: 'Computer Science',
          gpa: 3.8,
          skills: [
            'Node.js',
            'Express',
            'TypeScript',
          ],
          bio: 'Test student profile',
          targetIndustry: 'Technology',
        },
      });

    const companyUser = await prisma.user.upsert({
      where: {
        email: 'company@test.com',
      },
      update: {
        password: passwordHash,
        role: Role.COMPANY,
      },
      create: {
        email: 'company@test.com',
        password: passwordHash,
        role: Role.COMPANY,
      },
    });

    const companyProfile =
      await prisma.companyProfile.upsert({
        where: {
          userId: companyUser.id,
        },
        update: {
          companyName: 'Test Company',
          industry: 'Technology',
        },
        create: {
          userId: companyUser.id,
          companyName: 'Test Company',
          industry: 'Technology',
        },
      });

    const existingJob = await prisma.jobPosting.findFirst({
      where: {
        companyId: companyProfile.id,
        title: 'Test Backend Developer',
      },
    });

    const job =
      existingJob ||
      (await prisma.jobPosting.create({
        data: {
          companyId: companyProfile.id,
          title: 'Test Backend Developer',
          description: 'Test Node.js backend job',
          requiredSkills: [
            'Node.js',
            'Express',
            'TypeScript',
          ],
          minGpa: 3.0,
          location: 'Remote',
          status: 'OPEN',
        },
      }));

    return res.status(201).json({
      success: true,
      message: 'Test data created',
      student: {
        id: studentUser.id,
        email: studentUser.email,
        password: 'password123',
        profileId: studentProfile.id,
      },
      company: {
        id: companyUser.id,
        email: companyUser.email,
        password: 'password123',
        profileId: companyProfile.id,
      },
      job: {
        id: job.id,
        title: job.title,
      },
    });
  } catch (error) {
    console.error('CREATE TEST DATA ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to create test data',
    });
  }
};