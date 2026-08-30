import { TimesheetStatus } from "../types";

const allowed: Record<TimesheetStatus, TimesheetStatus[]> = {
  DRAFT: ["SUBMITTED"],
  SUBMITTED: ["APPROVED", "REJECTED"],
  APPROVED: ["PAID"],
  REJECTED: ["DRAFT"],
  PAID: [],
};

export function assertValidTransition(
  from: TimesheetStatus,
  to: TimesheetStatus,
  hasLines: boolean,
): void {
  if (from === "PAID")
    throw new Error(
      "This timesheet has already been paid, so it can't be changed. Raise an adjustment for the next pay run instead.",
    );
  if (from === "DRAFT" && to === "SUBMITTED" && !hasLines)
    throw new Error("Add at least one line before submitting this timesheet.");
  if (!allowed[from].includes(to))
    throw new Error(
      `This timesheet is ${from.toLowerCase().replace("_", " ")}, so it cannot move to ${to.toLowerCase().replace("_", " ")} yet.`,
    );
}
