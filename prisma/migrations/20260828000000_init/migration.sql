CREATE TYPE "CisStatus" AS ENUM ('GROSS', 'NET_VERIFIED', 'UNMATCHED');
CREATE TYPE "TimesheetStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'PAID');
CREATE TYPE "LineKind" AS ENUM ('LABOUR', 'MATERIALS', 'EXPENSE');

CREATE TABLE "Worker" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "cisStatus" "CisStatus" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Worker_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Timesheet" (
  "id" TEXT NOT NULL,
  "workerId" TEXT NOT NULL,
  "weekEnding" DATE NOT NULL,
  "status" "TimesheetStatus" NOT NULL DEFAULT 'DRAFT',
  "advanceRepaymentRequestedPence" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Timesheet_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TimesheetLine" (
  "id" TEXT NOT NULL,
  "timesheetId" TEXT NOT NULL,
  "date" DATE NOT NULL,
  "kind" "LineKind" NOT NULL,
  "quantity" DECIMAL(10,2) NOT NULL,
  "unit" TEXT NOT NULL,
  "ratePence" INTEGER NOT NULL,
  "position" INTEGER NOT NULL,
  CONSTRAINT "TimesheetLine_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Worker_name_key" ON "Worker"("name");
CREATE INDEX "Timesheet_workerId_idx" ON "Timesheet"("workerId");
CREATE INDEX "TimesheetLine_timesheetId_date_position_idx" ON "TimesheetLine"("timesheetId", "date", "position");
ALTER TABLE "Timesheet" ADD CONSTRAINT "Timesheet_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "Worker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "TimesheetLine" ADD CONSTRAINT "TimesheetLine_timesheetId_fkey" FOREIGN KEY ("timesheetId") REFERENCES "Timesheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
