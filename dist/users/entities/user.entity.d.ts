import { Note } from 'src/notes/entities/note.entity';
export declare class User {
    id: number;
    username: string;
    password: string;
    apiKey: string;
    role: 'user' | 'admin' | 'super-admin';
    notes: Note[];
}
