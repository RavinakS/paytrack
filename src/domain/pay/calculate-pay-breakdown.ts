import { PayBreakdown, PayBreakdownLine, Timesheet, TimesheetLine, Worker } from '../types';
import { hundredthsToQuantity, quantityToHundredths, roundHalfUpOneAndAHalf, roundHalfUpProduct } from './rounding';

const STANDARD_HOURS_HUNDREDTHS = 4_000;
const cisRate = (status: Worker['cisStatus']): number => ({ GROSS: 0, NET_VERIFIED: 20, UNMATCHED: 30 })[status];

export function calculatePayBreakdown(worker: Worker, timesheet: Timesheet): PayBreakdown {
  let usedLabourHundredths = 0;
  const results = new Map<string, PayBreakdownLine>();
  let labourTotalPence = 0;
  let materialsTotalPence = 0;
  let expensesTotalPence = 0;

  const labourInCalculationOrder = timesheet.lines
    .map((line, position) => ({ line, position }))
    .filter(({ line }) => line.kind === 'LABOUR')
    .sort((a, b) => a.line.date.localeCompare(b.line.date) || a.position - b.position);

  for (const { line } of labourInCalculationOrder) {
    const hours = quantityToHundredths(line.quantity);
    const standard = Math.max(0, Math.min(hours, STANDARD_HOURS_HUNDREDTHS - usedLabourHundredths));
    const overtime = hours - standard;
    const overtimeRatePence = overtime === 0 ? 0 : roundHalfUpOneAndAHalf(line.ratePence);
    const lineAmountPence = roundHalfUpProduct(standard, line.ratePence) + roundHalfUpProduct(overtime, overtimeRatePence);
    usedLabourHundredths += hours;
    labourTotalPence += lineAmountPence;
    results.set(line.id, { lineId: line.id, standardHours: hundredthsToQuantity(standard), overtimeHours: hundredthsToQuantity(overtime), overtimeRatePence, lineAmountPence });
  }

  for (const line of timesheet.lines.filter((candidate) => candidate.kind !== 'LABOUR')) {
    const lineAmountPence = roundHalfUpProduct(quantityToHundredths(line.quantity), line.ratePence);
    results.set(line.id, { lineId: line.id, standardHours: 0, overtimeHours: 0, overtimeRatePence: 0, lineAmountPence });
    if (line.kind === 'MATERIALS') materialsTotalPence += lineAmountPence;
    else expensesTotalPence += lineAmountPence;
  }

  const grossPence = labourTotalPence + materialsTotalPence + expensesTotalPence;
  const cisRatePercent = cisRate(worker.cisStatus);
  const cisDeductionPence = Math.trunc((labourTotalPence * cisRatePercent) / 100);
  const netBeforeRepaymentPence = grossPence - cisDeductionPence;
  const repaymentAppliedPence = Math.max(0, Math.min(timesheet.advanceRepaymentRequestedPence, netBeforeRepaymentPence));
  const carriedForwardPence = timesheet.advanceRepaymentRequestedPence - repaymentAppliedPence;
  return { lines: timesheet.lines.map((line) => results.get(line.id) as PayBreakdownLine), labourTotalPence, materialsTotalPence, expensesTotalPence, grossPence, cisRatePercent, cisDeductionPence, netBeforeRepaymentPence, repaymentAppliedPence, carriedForwardPence, netPayPence: netBeforeRepaymentPence - repaymentAppliedPence };
}
