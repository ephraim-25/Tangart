import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  async create(@Body() body: { courseId: string; stars: number; comment?: string; authorId: string }) {
    return this.reviewsService.submitReview(body);
  }

  @Get('course/:courseId')
  async getByCourse(@Param('courseId') courseId: string) {
    return this.reviewsService.getCourseReviews(courseId);
  }
}
