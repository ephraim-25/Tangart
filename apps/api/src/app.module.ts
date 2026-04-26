import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { S3Module } from './s3/s3.module';
import { VideosModule } from './videos/videos.module';
import { PaymentsModule } from './payments/payments.module';
import { WalletsModule } from './wallets/wallets.module';
import { PrismaModule } from './prisma/prisma.module';
import { ForumsModule } from './forums/forums.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { ReviewsModule } from './reviews/reviews.module';
import { CertificationsModule } from './certifications/certifications.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), S3Module, VideosModule, PaymentsModule, WalletsModule, PrismaModule, ForumsModule, PortfolioModule, ReviewsModule, CertificationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
