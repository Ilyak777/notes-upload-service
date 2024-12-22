import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ nullable: true })
  fileUrl: string;

  @ManyToOne(() => User, (user) => user.notes, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  author: User;
}
