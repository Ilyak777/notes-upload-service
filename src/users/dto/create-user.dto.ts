import { IsString, IsOptional, IsEnum, IsArray } from 'class-validator';
import { Note } from 'src/notes/entities/note.entity';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  apiKey?: string;

  @IsEnum(['user', 'admin', 'super-admin'])
  @IsOptional()
  role?: 'user' | 'admin' | 'super-admin';

  @IsArray()
  @IsOptional()
  notes?: Note[];
}
