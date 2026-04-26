import { Controller, Get, Param, Res, Header } from '@nestjs/common';
import { CertificationsService } from './certifications.service';
import type { Response } from 'express';

@Controller('certifications')
export class CertificationsController {
  constructor(private readonly certificationsService: CertificationsService) {}

  @Get(':courseId/:studentId/download')
  @Header('Content-Type', 'application/pdf')
  async downloadCertificate(
    @Param('courseId') courseId: string,
    @Param('studentId') studentId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const file = await this.certificationsService.generateCertificateStream(studentId, courseId);
    res.set({
      'Content-Disposition': `attachment; filename="Certificat_${courseId}.pdf"`,
    });
    return file;
  }
}
