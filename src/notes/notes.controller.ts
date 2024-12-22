import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Request,
  UploadedFile,
  UseInterceptors,
  Put,
  Delete,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { CompositeAuthGuard } from '../auth/guards/composite-auth.guard';

@ApiTags('Notes')
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @UseGuards(CompositeAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueSuffix);
        },
      }),
      limits: { fileSize: 50 * 1024 * 1024 },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create note with optional file',
    type: CreateNoteDto,
  })
  @ApiOperation({ summary: 'Create a new note' })
  async createNote(
    @Body() createNoteDto: CreateNoteDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ): Promise<any> {
    const user = req.user || null;
    if (file) {
      createNoteDto.fileUrl = `/uploads/${file.filename}`;
    }
    const note = await this.notesService.createNote(createNoteDto, user);
    return note;
  }

  @Get(':id')
  @UseGuards(CompositeAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get note by ID' })
  async getNoteById(
    @Param('id') id: number,
    @Request() req: any,
  ): Promise<any> {
    const user = req.user || null;
    return this.notesService.getNoteById(id, user);
  }

  @Put(':id')
  @UseGuards(CompositeAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueSuffix);
        },
      }),
      limits: { fileSize: 50 * 1024 * 1024 },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Update note with optional file',
    type: UpdateNoteDto,
  })
  @ApiOperation({ summary: 'Update an existing note' })
  async updateNote(
    @Param('id') id: number,
    @Body() updateNoteDto: UpdateNoteDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ): Promise<any> {
    const user = req.user || null;
    if (file) {
      updateNoteDto.fileUrl = `/uploads/${file.filename}`;
    }
    return this.notesService.updateNote(id, updateNoteDto, user);
  }

  @Delete(':id')
  @UseGuards(CompositeAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a note' })
  async deleteNote(
    @Param('id') id: number,
    @Request() req: any,
  ): Promise<{ message: string }> {
    const user = req.user || null;
    await this.notesService.deleteNote(id, user);
    return { message: 'Note deleted successfully' };
  }

  @Get()
  @UseGuards(CompositeAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all notes' })
  async getAllNotes(@Request() req: any): Promise<any[]> {
    const user = req.user || null;
    return this.notesService.getAllNotes(user);
  }
}
