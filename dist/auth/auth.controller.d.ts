import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
}
