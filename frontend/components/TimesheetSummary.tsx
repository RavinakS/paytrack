"use client";

import { ApiTimesheetResponse, TimesheetStatus } from "../lib/types";
import { formatMoney } from "../lib/utils";

type TimesheetSummaryProps = {
  data: ApiTimesheetResponse;
  nextTransitions: TimesheetStatus[];
  isTransitioning: boolean;
  onTransition: (to: TimesheetStatus) => void;
};

export function TimesheetSummary({ data, nextTransitions, isTransitioning, onTransition }: TimesheetSummaryProps) {
  return (
    <section className="panel results-panel">
      <div className="summary-header">
        <div>
          <p className="eyebrow">Timesheet</p>
          <h2>{data.timesheet.id}</h2>
        </div>
        <div className="status-pill status-pill--dark">{data.timesheet.status}</div>
      </div>

      <div className="summary-grid">
        <div>
          <span>Worker</span>
          <strong>{data.worker.name}</strong>
        </div>
        <div>
          <span>Week ending</span>
          <strong>{data.timesheet.weekEnding}</strong>
        </div>
        <div>
          <span>Advance request</span>
          <strong>{formatMoney(data.timesheet.advanceRepaymentRequestedPence)}</strong>
        </div>
        <div>
          <span>CIS status</span>
          <strong>{data.worker.cisStatus}</strong>
        </div>
      </div>

      <div className="grid-two">
        <div className="sub-panel">
          <h3>Entries</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Kind</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Rate</th>
              </tr>
            </thead>
            <tbody>
              {data.timesheet.lines.map((line) => (
                <tr key={line.id}>
                  <td>{line.date}</td>
                  <td>{line.kind}</td>
                  <td>{line.quantity}</td>
                  <td>{line.unit}</td>
                  <td>{formatMoney(line.ratePence)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="sub-panel">
          <h3>Breakdown</h3>
          <div className="breakdown-grid">
            <div>
              <span>Labour</span>
              <strong>{formatMoney(data.breakdown.labourTotalPence)}</strong>
            </div>
            <div>
              <span>Materials</span>
              <strong>{formatMoney(data.breakdown.materialsTotalPence)}</strong>
            </div>
            <div>
              <span>Expenses</span>
              <strong>{formatMoney(data.breakdown.expensesTotalPence)}</strong>
            </div>
            <div>
              <span>Gross</span>
              <strong>{formatMoney(data.breakdown.grossPence)}</strong>
            </div>
            <div>
              <span>CIS rate</span>
              <strong>{data.breakdown.cisRatePercent}%</strong>
            </div>
            <div>
              <span>CIS deduction</span>
              <strong>{formatMoney(data.breakdown.cisDeductionPence)}</strong>
            </div>
            <div>
              <span>Net before repayment</span>
              <strong>{formatMoney(data.breakdown.netBeforeRepaymentPence)}</strong>
            </div>
            <div>
              <span>Repayment applied</span>
              <strong>{formatMoney(data.breakdown.repaymentAppliedPence)}</strong>
            </div>
            <div>
              <span>Carried forward</span>
              <strong>{formatMoney(data.breakdown.carriedForwardPence)}</strong>
            </div>
            <div>
              <span>Net pay</span>
              <strong>{formatMoney(data.breakdown.netPayPence)}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="transition-panel">
        <h3>Workflow actions</h3>
        <div className="transition-buttons">
          {nextTransitions.length === 0 && <p>No valid transitions from this status.</p>}

          {nextTransitions.map((state) => (
            <button
              key={state}
              type="button"
              className="primary-button"
              onClick={() => onTransition(state)}
              disabled={isTransitioning}
            >
              {isTransitioning ? "Updating..." : `Move to ${state}`}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
