import { Module } from '@nestjs/common';
import { TimesheetsController } from './timesheets.controller';
import { TimesheetsService } from './timesheets.service';
import { WorkersController } from '../workers/workers.controller';

@Module({
  controllers: [TimesheetsController, WorkersController],
  providers: [TimesheetsService],
})
export class TimesheetsModule {}
