import { Controller, Post, Headers, Req, Res, UnauthorizedException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import type { Request, Response } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('webhooks/flutterwave')
  async handleFlutterwaveWebhook(
    @Headers('verif-hash') signature: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    // 1. Validate signature mathematically
    const isValid = this.paymentsService.verifyWebhookHash(signature);
    if (!isValid) {
      // Reject fake payments immediately
      throw new UnauthorizedException('Invalid Flutterwave Webhook Signature');
    }

    const event = req.body;
    console.log(`Received Flutterwave Webhook: ${event.event} for tx_ref: ${event.data?.tx_ref}`);

    // Acknowledge receipt to Flutterwave so they stop retrying
    res.status(200).send('Webhook Received');

    // 2. Instant Access Automation via Webhook
    if (event.event === 'charge.completed' && event.data.status === 'successful') {
      const courseId = event.data.meta?.course_id;
      const amountUSD = event.data.amount;
      const currency = event.data.currency; // USD

      // TODO: Wrap in Prisma Transaction
      // - Insert into TRANSACTION table (Status = SUCCESS, Method = event.data.payment_type)
      // - Emit Socket.io push notification to user ("Bienvenue dans votre formation Plam's Art !")
      // - Insert into ENROLLMENT table to instantly unlock video access

      console.log(`Simultaneous Enrollment Triggered for Course ${courseId} at $${amountUSD} ${currency}`);
    }
  }
}
