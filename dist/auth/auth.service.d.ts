import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
        user: {
            name: string;
            email: string;
            username: string;
            id: string;
            balance: import("@prisma/client/runtime/library").Decimal;
            createdAt: Date;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            name: any;
            email: any;
            username: any;
            balance: any;
        };
    }>;
    validateUser(username: string, password: string): Promise<any>;
    findUserById(id: string): Promise<{
        name: string;
        email: string;
        username: string;
        id: string;
        balance: import("@prisma/client/runtime/library").Decimal;
        createdAt: Date;
    } | null>;
}
