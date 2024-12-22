import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { username: registerDto.username },
    });
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const apiKey = crypto.randomBytes(32).toString('hex');

    const user = this.userRepository.create({
      username: registerDto.username,
      password: hashedPassword,
      apiKey,
      role: 'user',
    });

    return this.userRepository.save(user);
  }

  async login(authDto: AuthDto): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findOne({
      where: { username: authDto.username },
    });
    if (!user || !(await bcrypt.compare(authDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  async validateUser(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }

  async validateApiKey(apiKey: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { apiKey } });
    if (!user) throw new UnauthorizedException('Invalid API key');
    return user;
  }
}
