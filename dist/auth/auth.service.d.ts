import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<User>;
    login(authDto: AuthDto): Promise<{
        accessToken: string;
    }>;
    validateUser(userId: number): Promise<User>;
    validateApiKey(apiKey: string): Promise<User>;
}
