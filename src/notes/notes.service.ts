import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { Repository, Connection } from 'typeorm';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { ExternalSpellCheckService } from '../shared/external-spell-check.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
    private readonly spellCheckService: ExternalSpellCheckService,
    private readonly connection: Connection,
  ) {}

  async createNote(createNoteDto: CreateNoteDto, user?: User): Promise<Note> {
    const isValid = await this.spellCheckService.checkSpell(
      createNoteDto.content,
    );
    if (!isValid) {
      throw new ForbiddenException('Content failed spell check');
    }

    return await this.connection.transaction(async (manager) => {
      const note = this.noteRepository.create({
        title: createNoteDto.title,
        content: createNoteDto.content,
        fileUrl: createNoteDto.fileUrl,
        author: user || null,
      });
      return manager.save(note);
    });
  }

  async getNoteById(noteId: number, requester?: User): Promise<Partial<Note>> {
    const note = await this.noteRepository.findOne({
      where: { id: noteId },
      relations: ['author'],
    });
    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return this.applyVisibility(note, requester);
  }

  async updateNote(
    noteId: number,
    updateNoteDto: UpdateNoteDto,
    requester?: User,
  ): Promise<Note> {
    const note = await this.noteRepository.findOne({
      where: { id: noteId },
      relations: ['author'],
    });
    if (!note) {
      throw new NotFoundException('Note not found');
    }

    if (
      requester &&
      note.author &&
      note.author.id !== requester.id &&
      requester.role !== 'super-admin'
    ) {
      throw new ForbiddenException(
        'You do not have permission to update this note',
      );
    }

    if (updateNoteDto.content) {
      const isValid = await this.spellCheckService.checkSpell(
        updateNoteDto.content,
      );
      if (!isValid) {
        throw new ForbiddenException('Content failed spell check');
      }
    }

    Object.assign(note, updateNoteDto);
    return this.noteRepository.save(note);
  }
  async deleteNote(noteId: number, requester?: User): Promise<void> {
    const note = await this.noteRepository.findOne({
      where: { id: noteId },
      relations: ['author'],
    });
    if (!note) {
      throw new NotFoundException('Note not found');
    }

    if (
      requester &&
      note.author &&
      note.author.id !== requester.id &&
      requester.role !== 'super-admin'
    ) {
      throw new ForbiddenException(
        'You do not have permission to delete this note',
      );
    }

    await this.noteRepository.remove(note);
  }

  async getAllNotes(requester?: User): Promise<Partial<Note>[]> {
    const notes = await this.noteRepository.find({ relations: ['author'] });
    return notes.map((note) => this.applyVisibility(note, requester));
  }

  private applyVisibility(note: Note, requester?: User): Partial<Note> {
    if (!requester) {
      return {
        id: note.id,
        title: note.title,
        content: undefined,
      };
    }

    if (note.author && note.author.id === requester.id) {
      return note;
    }

    if (requester.role === 'super-admin') {
      return note;
    }

    return {
      id: note.id,
      title: note.title,
      content: undefined,
    };
  }

  async getUserNotesCount(userId: number): Promise<number> {
    return this.noteRepository.count({ where: { author: { id: userId } } });
  }
}
