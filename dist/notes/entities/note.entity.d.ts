import { User } from 'src/users/entities/user.entity';
export declare class Note {
    id: number;
    title: string;
    content: string;
    fileUrl: string;
    author: User;
}
