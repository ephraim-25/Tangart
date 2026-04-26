import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PortfolioService {
  constructor(private readonly prisma: PrismaService) {}

  async submitPortfolio(data: { studentId: string; fileUrl: string; isPublicGallery: boolean }) {
    return this.prisma.submission.create({
      data: {
        studentId: data.studentId,
        fileUrl: data.fileUrl,
        isPublicGallery: data.isPublicGallery,
      },
    });
  }

  async addTeacherFeedback(submissionId: string, data: { teacherId: string; grade: number; feedback: string }) {
    const submission = await this.prisma.submission.findUnique({
      where: { id: submissionId },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    return this.prisma.submission.update({
      where: { id: submissionId },
      data: {
        grade: data.grade,
        feedback: data.feedback,
      },
    });
  }

  async getPublicGallery() {
    return this.prisma.submission.findMany({
      where: { isPublicGallery: true, grade: { not: null } },
      include: {
        student: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
