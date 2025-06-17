import { Controller, Get, Post, Body, UseGuards, Request, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { BankingService } from './banking.service';
import { TransferDto } from './dto/transfer.dto';

@Controller('banking')
@UseGuards(AuthGuard('jwt'))
export class BankingController {
  constructor(private bankingService: BankingService) {}

  @Get('dashboard')
  async getDashboard(@Request() req) {
    return this.bankingService.getDashboardData(req.user.id);
  }

  @Get('balance')
  async getBalance(@Request() req) {
    return this.bankingService.getBalance(req.user.id);
  }

  @Post('transfer')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 transfers per minute
  async transfer(@Request() req, @Body(ValidationPipe) transferDto: TransferDto) {
    return this.bankingService.transferMoney(req.user.id, transferDto);
  }

  @Get('transactions')
  async getTransactions(@Request() req) {
    return this.bankingService.getTransactionHistory(req.user.id);
  }
} 