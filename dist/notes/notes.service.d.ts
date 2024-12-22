import { Note } from './entities/note.entity';
import { Repository, Connection } from 'typeorm';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { ExternalSpellCheckService } from '../shared/external-spell-check.service';
import { User } from '../users/entities/user.entity';
export declare class NotesService {
    private readonly noteRepository;
    private readonly spellCheckService;
    private readonly connection;
    constructor(noteRepository: Repository<Note>, spellCheckService: ExternalSpellCheckService, connection: Connection);
    createNote(createNoteDto: CreateNoteDto, user?: User): Promise<Note>;
    getNoteById(noteId: number, requester?: User): Promise<Partial<Note>>;
    updateNote(noteId: number, updateNoteDto: UpdateNoteDto, requester?: User): Promise<Note>;
    deleteNote(noteId: number, requester?: User): Promise<void>;
    getAllNotes(requester?: User): Promise<Partial<Note>[]>;
    private applyVisibility;
    getUserNotesCount(userId: number): Promise<number>;
}
