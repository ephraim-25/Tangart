import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME') || 'plams-art-storage';
    
    // In production, configure with actual credentials from ConfigService
    // We provide dummy values to prevent crash if not perfectly configured in .env yet
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION') || 'eu-west-3',
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID') || 'dummy_key',
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY') || 'dummy_secret',
      },
    });
  }

  async getPresignedUploadUrl(filename: string, contentType: string): Promise<{ url: string; key: string }> {
    try {
      const key = `uploads/${Date.now()}-${filename.replace(/\s+/g, '-')}`;
      
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        ContentType: contentType,
      });

      // URL valid for 1 hour
      const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
      return { url, key };
    } catch (error) {
      console.error('Error generating pre-signed URL', error);
      throw new InternalServerErrorException('Could not generate upload URL');
    }
  }
}
