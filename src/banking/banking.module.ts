import { Module } from '@nestjs/common';
import { BankingService } from './banking.service';
import { BankingController } from './banking.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [BankingService, PrismaService],
  controllers: [BankingController],
})
export class BankingModule {} 