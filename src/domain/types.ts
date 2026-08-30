export type CisStatus = 'GROSS' | 'NET_VERIFIED' | 'UNMATCHED';
export type LineKind = 'LABOUR' | 'MATERIALS' | 'EXPENSE';
export type TimesheetStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'PAID';

export interface Worker { id: string; name: string; cisStatus: CisStatus; }
export interface TimesheetLine { id: string; date: string; kind: LineKind; quantity: number; unit: string; ratePence: number; }
export interface Timesheet { id: string; workerId: string; weekEnding: string; status: TimesheetStatus; lines: TimesheetLine[]; advanceRepaymentRequestedPence: number; }
export interface PayBreakdownLine { lineId: string; standardHours: number; overtimeHours: number; overtimeRatePence: number; lineAmountPence: number; }
export interface PayBreakdown {
  lines: PayBreakdownLine[]; labourTotalPence: number; materialsTotalPence: number; expensesTotalPence: number;
  grossPence: number; cisRatePercent: number; cisDeductionPence: number; netBeforeRepaymentPence: number;
  repaymentAppliedPence: number; carriedForwardPence: number; netPayPence: number;
}
