import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { CreateTimesheetDto } from "./dto/create-timesheet.dto";
import { TransitionTimesheetDto } from "./dto/transition-timesheet.dto";
import { TimesheetsService } from "./timesheets.service";

@Controller("timesheets")
export class TimesheetsController {
  constructor(private readonly timesheets: TimesheetsService) {}
  @Get("workers") findAllWorkers() {
    return this.timesheets.findAllWorkers();
  }

  @Post() create(@Body() dto: CreateTimesheetDto) {
    return this.timesheets.create(dto);
  }

  @Post(":id/transition") @HttpCode(200) transition(
    @Param("id") id: string,
    @Body() dto: TransitionTimesheetDto,
  ) {
    return this.timesheets.transition(id, dto);
  }

  @Get(":id") findOne(@Param("id") id: string) {
    return this.timesheets.findOne(id);
  }
}
