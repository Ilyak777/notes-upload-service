import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findById(id: number): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: { id: id },
      relations: ['notes'],
    });
  }

  async findByApiKey(apiKey: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { apiKey } });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async getUserNotesCount(userId: number): Promise<number> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['notes'],
    });
    return user ? user.notes.length : 0;
  }
}
