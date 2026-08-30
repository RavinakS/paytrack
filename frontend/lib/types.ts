export type LineKind = "LABOUR" | "MATERIALS" | "EXPENSE";
export type TimesheetStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED" | "PAID";

export type FormLine = {
  id: number;
  date: string;
  kind: LineKind;
  quantity: string;
  unit: string;
  ratePence: string;
};

export type ApiTimesheetLine = {
  id: string;
  date: string;
  kind: LineKind;
  quantity: number;
  unit: string;
  ratePence: number;
};

export type ApiWorker = {
  id: string;
  name: string;
  cisStatus: "GROSS" | "NET_VERIFIED" | "UNMATCHED";
};

export type TimesheetBreakdownLine = {
  lineId: string;
  standardHours: number;
  overtimeHours: number;
  overtimeRatePence: number;
  lineAmountPence: number;
};

export type TimesheetBreakdown = {
  labourTotalPence: number;
  materialsTotalPence: number;
  expensesTotalPence: number;
  grossPence: number;
  cisRatePercent: number;
  cisDeductionPence: number;
  netBeforeRepaymentPence: number;
  repaymentAppliedPence: number;
  carriedForwardPence: number;
  netPayPence: number;
  lines: TimesheetBreakdownLine[];
};

export type ApiTimesheetResponse = {
  timesheet: {
    id: string;
    workerId: string;
    weekEnding: string;
    status: TimesheetStatus;
    advanceRepaymentRequestedPence: number;
    lines: ApiTimesheetLine[];
  };
  worker: ApiWorker;
  breakdown: TimesheetBreakdown;
};
