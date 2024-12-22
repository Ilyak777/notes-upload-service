import { Injectable } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiKeyGuard } from './api-key-auth.guard';

@Injectable()
export class CompositeAuthGuard {
  static getGuards() {
    return [JwtAuthGuard, ApiKeyGuard];
  }
}
