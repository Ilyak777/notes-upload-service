import { IsString, IsOptional, IsUrl } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsUrl()
  fileUrl?: string;
}
