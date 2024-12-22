import { Note } from 'src/notes/entities/note.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true, unique: true })
  apiKey: string;

  @Column({ default: 'user' })
  role: 'user' | 'admin' | 'super-admin';

  @OneToMany(() => Note, (note) => note.author)
  notes: Note[];
}
