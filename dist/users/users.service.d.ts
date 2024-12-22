import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    findById(id: number): Promise<User | undefined>;
    findByApiKey(apiKey: string): Promise<User | undefined>;
    createUser(createUserDto: CreateUserDto): Promise<User>;
    getUserNotesCount(userId: number): Promise<number>;
}
