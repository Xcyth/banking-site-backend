import { BankingService } from './banking.service';
import { TransferDto } from './dto/transfer.dto';
export declare class BankingController {
    private bankingService;
    constructor(bankingService: BankingService);
    getDashboard(req: any): Promise<{
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
    getBalance(req: any): Promise<{
        balance: import("@prisma/client/runtime/library").Decimal;
    }>;
    transfer(req: any, transferDto: TransferDto): Promise<{
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
    getTransactions(req: any): Promise<{
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
}
