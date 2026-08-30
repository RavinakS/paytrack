import { Controller, Get } from '@nestjs/common';
import { TimesheetsService } from '../timesheets/timesheets.service';

@Controller('workers')
export class WorkersController {
  constructor(private readonly timesheets: TimesheetsService) {}

  @Get()
  listWorkers() {
    return this.timesheets.findAllWorkers();
  }
}
