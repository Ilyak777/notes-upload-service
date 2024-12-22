import { Note } from 'src/notes/entities/note.entity';
export declare class CreateUserDto {
    username: string;
    password: string;
    apiKey?: string;
    role?: 'user' | 'admin' | 'super-admin';
    notes?: Note[];
}
