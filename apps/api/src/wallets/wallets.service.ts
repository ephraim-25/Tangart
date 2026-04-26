import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const Flutterwave = require('flutterwave-node-v3');

@Injectable()
export class WalletsService {
  private flw: any;

  constructor(private configService: ConfigService) {
    this.flw = new Flutterwave(
      this.configService.get<string>('FLW_PUBLIC_KEY') || 'dummy_pk',
      this.configService.get<string>('FLW_SECRET_KEY') || 'dummy_sk'
    );
  }

  // Teacher Subaccount creation on first course publish
  async createTeacherSubaccount(teacherInfo: { account_bank: string; account_number: string; business_name: string; business_email: string; split_value: number }) {
    try {
      const payload = {
        account_bank: teacherInfo.account_bank,
        account_number: teacherInfo.account_number,
        business_name: teacherInfo.business_name,
        business_email: teacherInfo.business_email,
        business_mobile: "",
        country: "CD", // DRC Focus context
        split_type: "percentage",
        split_value: teacherInfo.split_value / 100 // 0.92 per API docs usually, or just 92 depending on API version
      };

      const response = await this.flw.Subaccount.create(payload);
      // We would store response.data.subaccount_id in the PostgreSQL DB
      return response.data;
    } catch (error) {
       console.error("Error creating Teacher Subaccount:", error);
       throw new InternalServerErrorException('Could not provision financial subaccount');
    }
  }

  // Handle withdrawing the USD accumulated funds via Flutterwave Transfers
  async requestWithdrawal(amountUSD: number, destinationPhoneNumber: string, bankCode: string = 'FASENET') {
    try {
      const payload = {
        account_bank: bankCode, // "FASENET" for Mobile Money in FLW API, or specific bank code
        account_number: destinationPhoneNumber,
        amount: amountUSD,
        currency: "USD",
        narration: "Plams Art Teacher Withdrawal",
        reference: `withdraw_${Date.now()}`
      };

      // Ensure platform uses USD uniformly inside DB, then FLW converts to CDF at Payout automatically if the account is local.
      const response = await this.flw.Transfer.initiate(payload);
      return response.data;
    } catch (error) {
       console.error("Error initiating withdrawal:", error);
       throw new InternalServerErrorException('Withdrawal failed');
    }
  }
}
