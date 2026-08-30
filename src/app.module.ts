import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { TimesheetsModule } from './timesheets/timesheets.module';
@Module({ imports: [PrismaModule, TimesheetsModule] })
export class AppModule {}
