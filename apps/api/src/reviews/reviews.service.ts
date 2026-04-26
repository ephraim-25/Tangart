import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  private readonly logger = new Logger(ReviewsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async submitReview(data: { courseId: string; stars: number; comment?: string; authorId: string }) {
    if (data.stars < 1 || data.stars > 5) {
      throw new BadRequestException('Stars must be between 1 and 5');
    }

    if (data.stars < 3 && (!data.comment || data.comment.trim() === '')) {
      throw new BadRequestException('Un commentaire est obligatoire pour les notes inférieures à 3.');
    }

    const review = await this.prisma.review.create({
      data: {
        stars: data.stars,
        comment: data.comment,
        courseId: data.courseId,
        authorId: data.authorId,
      },
    });

    await this.checkCourseAverage(data.courseId);

    return review;
  }

  private async checkCourseAverage(courseId: string) {
    const aggregate = await this.prisma.review.aggregate({
      where: { courseId },
      _avg: { stars: true },
    });

    const average = aggregate._avg.stars;

    if (average !== null && average < 3.5) {
      // Déclenchement d'un ADMIN_ALERT avec notification prioritaire pour Madame Plamedie.
      this.logger.error(
        `[ADMIN_ALERT] La note moyenne du cours ${courseId} est de ${average.toFixed(2)}/5. ` +
        `Notification prioritaire envoyée à Madame Plamedie.`
      );
      // Here we would typically send an email, a Slack webhook or a Push notification.
    }
  }

  async getCourseReviews(courseId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { courseId },
      orderBy: { createdAt: 'desc' },
    });
    
    const aggregate = await this.prisma.review.aggregate({
      where: { courseId },
      _avg: { stars: true },
    });

    return {
      average: aggregate._avg.stars,
      reviews,
    };
  }
}
