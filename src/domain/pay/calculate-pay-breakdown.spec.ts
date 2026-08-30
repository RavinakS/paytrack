import { calculatePayBreakdown } from './calculate-pay-breakdown';
import { Timesheet, Worker } from '../types';

const worker: Worker = { id: 'worker-1', name: 'Asha', cisStatus: 'NET_VERIFIED' };
const createTimesheet = (lines: Timesheet['lines'], advanceRepaymentRequestedPence = 0): Timesheet => ({
  id: 'timesheet-1', workerId: worker.id, weekEnding: '2026-08-09', status: 'DRAFT', lines, advanceRepaymentRequestedPence,
});

describe('calculatePayBreakdown', () => {
  it('calculates standard labour and CIS deduction in integer pence', () => {
    const result = calculatePayBreakdown(worker, createTimesheet([{ id: 'L1', date: '2026-08-03', kind: 'LABOUR', quantity: 37.5, unit: 'hour', ratePence: 1837 }]));
    expect(result).toMatchObject({ labourTotalPence: 68888, grossPence: 68888, cisDeductionPence: 13777, netPayPence: 55111 });
  });

  it('splits a labour line at 40 hours and rounds each band separately', () => {
    const result = calculatePayBreakdown(worker, createTimesheet([
      { id: 'L1', date: '2026-08-03', kind: 'LABOUR', quantity: 24, unit: 'hour', ratePence: 2150 },
      { id: 'L2', date: '2026-08-05', kind: 'LABOUR', quantity: 21.5, unit: 'hour', ratePence: 1975 },
      { id: 'L3', date: '2026-08-05', kind: 'MATERIALS', quantity: 4, unit: 'each', ratePence: 1250 },
    ]));
    expect(result.lines[1]).toEqual({ lineId: 'L2', standardHours: 16, overtimeHours: 5.5, overtimeRatePence: 2963, lineAmountPence: 47897 });
    expect(result).toMatchObject({ labourTotalPence: 99497, materialsTotalPence: 5000, grossPence: 104497, cisDeductionPence: 19899, netPayPence: 84598 });
  });

  it('deducts CIS from labour only, not materials', () => {
    const result = calculatePayBreakdown(worker, createTimesheet([
      { id: 'L1', date: '2026-08-03', kind: 'LABOUR', quantity: 32, unit: 'hour', ratePence: 2025 },
      { id: 'L2', date: '2026-08-07', kind: 'MATERIALS', quantity: 2, unit: 'each', ratePence: 4499 },
    ]));
    expect(result).toMatchObject({ labourTotalPence: 64800, materialsTotalPence: 8998, cisDeductionPence: 12960, netPayPence: 60838 });
  });

  it('never recovers more advance than the worker has after CIS', () => {
    const result = calculatePayBreakdown(worker, createTimesheet([{ id: 'L1', date: '2026-08-06', kind: 'LABOUR', quantity: 8, unit: 'hour', ratePence: 1500 }], 15000));
    expect(result).toMatchObject({ netBeforeRepaymentPence: 9600, repaymentAppliedPence: 9600, carriedForwardPence: 5400, netPayPence: 0 });
  });
});
