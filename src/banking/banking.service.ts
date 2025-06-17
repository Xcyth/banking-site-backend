import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransferDto } from './dto/transfer.dto';

@Injectable()
export class BankingService {
  constructor(private prisma: PrismaService) {}

  async getBalance(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return { balance: user.balance };
  }

  async transferMoney(senderId: string, transferDto: TransferDto) {
    const { recipientUsername, amount, description } = transferDto;

    // Validate amount
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    return await this.prisma.$transaction(
      async (prisma) => {
        // Get sender and recipient data in parallel
        const [sender, recipient] = await Promise.all([
          prisma.user.findUnique({
            where: { id: senderId },
            select: { id: true, username: true, balance: true },
          }),
          prisma.user.findUnique({
            where: { username: recipientUsername },
            select: { id: true, username: true, balance: true },
          }),
        ]);

        if (!sender) {
          throw new NotFoundException('Sender not found');
        }

        if (!recipient) {
          throw new NotFoundException('Recipient not found');
        }

        // Check if sender is trying to send to themselves
        if (sender.id === recipient.id) {
          throw new BadRequestException('Cannot transfer money to yourself');
        }

        // Check if sender has sufficient balance
        if (Number(sender.balance) < amount) {
          throw new BadRequestException('Insufficient balance');
        }

        // Update balances and create transaction record in parallel
        const [updatedSender, updatedRecipient, transaction] = await Promise.all([
          prisma.user.update({
            where: { id: sender.id },
            data: { balance: { decrement: amount } },
          }),
          prisma.user.update({
            where: { id: recipient.id },
            data: { balance: { increment: amount } },
          }),
          prisma.transaction.create({
            data: {
              amount,
              description: description || `Transfer to ${recipient.username}`,
              senderId: sender.id,
              receiverId: recipient.id,
            },
            include: {
              sender: {
                select: { username: true, name: true },
              },
              receiver: {
                select: { username: true, name: true },
              },
            },
          }),
        ]);

        return {
          message: 'Transfer successful',
          transaction,
          newBalance: updatedSender.balance,
        };
      },
      {
        timeout: 10000, // Increase timeout to 10 seconds
      }
    );
  }

  async getTransactionHistory(userId: string) {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
      include: {
        sender: {
          select: { username: true, name: true },
        },
        receiver: {
          select: { username: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50, // Limit to last 50 transactions
    });

    return transactions.map(transaction => ({
      ...transaction,
      type: transaction.senderId === userId ? 'sent' : 'received',
    }));
  }

  async getDashboardData(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        username: true,
        balance: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const recentTransactions = await this.getTransactionHistory(userId);

    return {
      user,
      recentTransactions: recentTransactions.slice(0, 5), // Last 5 transactions
    };
  }
} 