import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
export declare class NotesController {
    private readonly notesService;
    constructor(notesService: NotesService);
    createNote(createNoteDto: CreateNoteDto, file: Express.Multer.File, req: any): Promise<any>;
    getNoteById(id: number, req: any): Promise<any>;
    updateNote(id: number, updateNoteDto: UpdateNoteDto, file: Express.Multer.File, req: any): Promise<any>;
    deleteNote(id: number, req: any): Promise<{
        message: string;
    }>;
    getAllNotes(req: any): Promise<any[]>;
}
