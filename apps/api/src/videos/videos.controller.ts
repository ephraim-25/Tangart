import { Controller, Post, Headers, Req, Res, BadRequestException, Get, Param } from '@nestjs/common';
import { VideosService } from './videos.service';
import type { Request, Response } from 'express';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get(':playbackId/tokens')
  async getTokens(@Param('playbackId') playbackId: string) {
    if (!playbackId) throw new BadRequestException('playbackId is required');
    return this.videosService.generateTokens(playbackId);
  }

  @Post('webhooks/mux')
  async handleMuxWebhook(
    @Headers('mux-signature') signature: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    // In NestJS, to get the raw body for signature verification, 
    // it's usually recommended to use a custom middleware for raw-body parsing.
    // For this POC, we stringify the JSON body
    const payload = JSON.stringify(req.body);

    const isValid = this.videosService.verifyWebhookSignature(payload, signature);
    if (!isValid) {
      return res.status(401).send('Invalid webhook signature');
    }

    const event = req.body;
    console.log(`Received Mux Webhook: ${event.type}`);

    // Update database depending on event type (e.g., video.asset.ready)
    if (event.type === 'video.asset.ready') {
      const assetId = event.data.id;
      const playbackId = event.data.playback_ids[0].id;
      // TODO: Update Prisma DB to mark video as ready for this assetId
      console.log(`Asset ${assetId} is ready for playback: ${playbackId}`);
    }

    return res.status(200).send('Webhook received');
  }
}
