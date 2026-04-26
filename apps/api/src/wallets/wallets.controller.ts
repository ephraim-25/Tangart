import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { WalletsService } from './wallets.service';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Post('withdraw')
  async withdrawFunds(
    @Body('amount') amount: number,
    @Body('phone') phone: string
  ) {
    if (!amount || !phone) {
      throw new BadRequestException('Amount (USD) and Mobile Money Phone Number are required');
    }
    // Teacher USD extraction. Conversion to local currency is managed by FLW standard payout engine.
    return this.walletsService.requestWithdrawal(amount, phone);
  }
}
