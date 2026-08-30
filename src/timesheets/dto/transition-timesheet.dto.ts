import { IsIn } from "class-validator";

const statuses = [
  "DRAFT",
  "SUBMITTED",
  "APPROVED",
  "REJECTED",
  "PAID",
] as const;

export class TransitionTimesheetDto {
  @IsIn(statuses) to!: (typeof statuses)[number];
}
