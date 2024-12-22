import {
  Controller,
  Get,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user info and notes count' })
  async getMe(
    @Request() req: any,
  ): Promise<{ username: string; notesCount: number }> {
    const user = await this.usersService.findById(req.user.id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const notesCount = await this.usersService.getUserNotesCount(user.id);
    return { username: user.username, notesCount };
  }
}
