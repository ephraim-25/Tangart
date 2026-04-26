import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

// Use require specifically for flutterwave-node-v3 as it does not export standard TS types properly out of the box
const Flutterwave = require('flutterwave-node-v3');

@Injectable()
export class PaymentsService {
  private flw: any;

  constructor(private configService: ConfigService) {
    this.flw = new Flutterwave(
      this.configService.get<string>('FLW_PUBLIC_KEY') || 'dummy_pk',
      this.configService.get<string>('FLW_SECRET_KEY') || 'dummy_sk'
    );
  }

  // Generate a payment link with proper 92/8 split routing to subaccount
  async initializePayment(amountUSD: number, userEmail: string, teacherSubaccountId: string, courseId: string) {
    try {
      const payload = {
        tx_ref: `plams_${Date.now()}_${courseId}`,
        amount: amountUSD.toString(),
        currency: "USD",
        payment_options: "card, mobilemoneyfranco, mobilemoneyuganda",
        redirect_url: "https://plamsart.com/dashboard/student/success",
        customer: {
          email: userEmail,
        },
        meta: {
          course_id: courseId,
        },
        subaccounts: [
          {
            id: teacherSubaccountId,
            transaction_split_ratio: "92"
          },
          {
            id: this.configService.get<string>('PLAMS_MAIN_ACCOUNT_ID') || 'RS_DUMMY_MAIN',
            transaction_split_ratio: "8"
          }
        ]
      };

      const response = await this.flw.Payment.create(payload);
      return response.data.link;
    } catch (error) {
      console.error('Error initiating Flutterwave payment:', error);
      throw new InternalServerErrorException('Could not create payment link');
    }
  }

  // Webhook validation logic (Mathematical Hash check)
  verifyWebhookHash(signature: string): boolean {
    const secretHash = this.configService.get<string>('FLW_SECRET_HASH') || 'dummy_hash';
    return signature === secretHash;
  }
}
