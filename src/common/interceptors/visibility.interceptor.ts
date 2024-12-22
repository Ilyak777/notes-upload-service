import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Note } from 'src/notes/entities/note.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class VisibilityInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const requester: User = req.user;

    return next.handle().pipe(
      map((data: Note | Note[]) => {
        if (Array.isArray(data)) {
          return data.map((note) => this.applyVisibility(note, requester));
        } else {
          return this.applyVisibility(data, requester);
        }
      }),
    );
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
}
