import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { calculatePayBreakdown } from "../domain/pay/calculate-pay-breakdown";
import { assertValidTransition } from "../domain/timesheet/transitions";
import { Timesheet, Worker } from "../domain/types";
import { PrismaService } from "../prisma/prisma.service";
import { CreateTimesheetDto } from "./dto/create-timesheet.dto";
import { TransitionTimesheetDto } from "./dto/transition-timesheet.dto";

@Injectable()
export class TimesheetsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTimesheetDto) {
    if (new Date(dto.weekEnding).getUTCDay() !== 0) {
      throw new BadRequestException("Week ending must be a Sunday.");
    }
    const worker = await this.prisma.worker.findUnique({
      where: { id: dto.workerId },
    });
    if (!worker)
      throw new NotFoundException("The selected worker could not be found.");
    return this.prisma.timesheet.create({
      data: {
        workerId: dto.workerId,
        weekEnding: new Date(dto.weekEnding),
        advanceRepaymentRequestedPence: dto.advanceRepaymentRequestedPence,
        lines: {
          create: dto.lines.map((line, position) => ({
            ...line,
            date: new Date(line.date),
            quantity: new Prisma.Decimal(line.quantity),
            position,
          })),
        },
      },
      include: { lines: { orderBy: { position: "asc" } } },
    });
  }

  async transition(id: string, dto: TransitionTimesheetDto) {
    const timesheet = await this.prisma.timesheet.findUnique({
      where: { id },
      include: { lines: true },
    });
    if (!timesheet)
      throw new NotFoundException("The timesheet could not be found.");
    try {
      assertValidTransition(
        timesheet.status,
        dto.to,
        timesheet.lines.length > 0,
      );
    } catch (error) {
      throw new ConflictException((error as Error).message);
    }
    return this.prisma.timesheet.update({
      where: { id },
      data: { status: dto.to },
      include: { lines: { orderBy: { position: "asc" } } },
    });
  }

  async findOne(id: string) {
    const record = await this.prisma.timesheet.findUnique({
      where: { id },
      include: { worker: true, lines: { orderBy: { position: "asc" } } },
    });
    if (!record)
      throw new NotFoundException("The timesheet could not be found.");
    const worker: Worker = {
      id: record.worker.id,
      name: record.worker.name,
      cisStatus: record.worker.cisStatus,
    };
    const timesheet: Timesheet = {
      id: record.id,
      workerId: record.workerId,
      weekEnding: record.weekEnding.toISOString().slice(0, 10),
      status: record.status,
      advanceRepaymentRequestedPence: record.advanceRepaymentRequestedPence,
      lines: record.lines.map((line) => ({
        id: line.id,
        date: line.date.toISOString().slice(0, 10),
        kind: line.kind,
        quantity: line.quantity.toNumber(),
        unit: line.unit,
        ratePence: line.ratePence,
      })),
    };
    return {
      timesheet,
      worker,
      breakdown: calculatePayBreakdown(worker, timesheet),
    };
  }
}
