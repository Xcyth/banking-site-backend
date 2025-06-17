import { PrismaService } from '../prisma/prisma.service';
import { TransferDto } from './dto/transfer.dto';
export declare class BankingService {
    private prisma;
    constructor(prisma: PrismaService);
    getBalance(userId: string): Promise<{
        balance: import("@prisma/client/runtime/library").Decimal;
    }>;
    transferMoney(senderId: string, transferDto: TransferDto): Promise<{
        message: string;
        transaction: {
            sender: {
                name: string;
                username: string;
            };
            receiver: {
                name: string;
                username: string;
            };
        } & {
            id: string;
            createdAt: Date;
            amount: import("@prisma/client/runtime/library").Decimal;
            description: string | null;
            senderId: string;
            receiverId: string;
        };
        newBalance: import("@prisma/client/runtime/library").Decimal;
    }>;
    getTransactionHistory(userId: string): Promise<{
        type: string;
        sender: {
            name: string;
            username: string;
        };
        receiver: {
            name: string;
            username: string;
        };
        id: string;
        createdAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        description: string | null;
        senderId: string;
        receiverId: string;
    }[]>;
    getDashboardData(userId: string): Promise<{
        user: {
            id: string;
            name: string;
            username: string;
            balance: import("@prisma/client/runtime/library").Decimal;
        };
        recentTransactions: {
            type: string;
            sender: {
                name: string;
                username: string;
            };
            receiver: {
                name: string;
                username: string;
            };
            id: string;
            createdAt: Date;
            amount: import("@prisma/client/runtime/library").Decimal;
            description: string | null;
            senderId: string;
            receiverId: string;
        }[];
    }>;
}
