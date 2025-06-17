"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BankingService = class BankingService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getBalance(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { balance: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return { balance: user.balance };
    }
    async transferMoney(senderId, transferDto) {
        const { recipientUsername, amount, description } = transferDto;
        if (amount <= 0) {
            throw new common_1.BadRequestException('Amount must be greater than 0');
        }
        return await this.prisma.$transaction(async (prisma) => {
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
                throw new common_1.NotFoundException('Sender not found');
            }
            if (!recipient) {
                throw new common_1.NotFoundException('Recipient not found');
            }
            if (sender.id === recipient.id) {
                throw new common_1.BadRequestException('Cannot transfer money to yourself');
            }
            if (Number(sender.balance) < amount) {
                throw new common_1.BadRequestException('Insufficient balance');
            }
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
        }, {
            timeout: 10000,
        });
    }
    async getTransactionHistory(userId) {
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
            take: 50,
        });
        return transactions.map(transaction => ({
            ...transaction,
            type: transaction.senderId === userId ? 'sent' : 'received',
        }));
    }
    async getDashboardData(userId) {
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
            throw new common_1.NotFoundException('User not found');
        }
        const recentTransactions = await this.getTransactionHistory(userId);
        return {
            user,
            recentTransactions: recentTransactions.slice(0, 5),
        };
    }
};
exports.BankingService = BankingService;
exports.BankingService = BankingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BankingService);
//# sourceMappingURL=banking.service.js.map