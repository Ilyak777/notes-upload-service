import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthDto } from './dto/auth.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<{ message: string }> {
    await this.authService.register(registerDto);
    return { message: 'User registered successfully' };
  }

  @Post('login')
  @ApiOperation({ summary: 'Login and obtain JWT' })
  async login(@Body() authDto: AuthDto): Promise<{ accessToken: string }> {
    return this.authService.login(authDto);
  }
}
