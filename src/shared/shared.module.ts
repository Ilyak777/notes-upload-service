import { Module, Global } from '@nestjs/common';
import { ExternalSpellCheckService } from './external-spell-check.service';

@Global()
@Module({
  providers: [ExternalSpellCheckService],
  exports: [ExternalSpellCheckService],
})
export class SharedModule {}
