import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { S3Service } from './s3.service';

@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Get('upload-url')
  async getUploadUrl(
    @Query('filename') filename: string,
    @Query('contentType') contentType: string,
  ) {
    if (!filename || !contentType) {
      throw new BadRequestException('filename and contentType are required');
    }

    return this.s3Service.getPresignedUploadUrl(filename, contentType);
  }
}
