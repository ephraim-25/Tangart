import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Post('submit')
  async submit(@Body() body: { studentId: string; fileUrl: string; isPublicGallery: boolean }) {
    return this.portfolioService.submitPortfolio(body);
  }

  @Post(':id/feedback')
  async feedback(
    @Param('id') id: string,
    @Body() body: { teacherId: string; grade: number; feedback: string }
  ) {
    return this.portfolioService.addTeacherFeedback(id, body);
  }

  @Get('gallery')
  async getGallery() {
    return this.portfolioService.getPublicGallery();
  }
}
