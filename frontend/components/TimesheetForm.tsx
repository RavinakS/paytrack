"use client";

import { FormLine } from "../lib/types";

type TimesheetFormProps = {
  workerId: string;
  weekEnding: string;
  advanceRepaymentRequestedPence: string;
  lines: FormLine[];
  isCreating: boolean;
  error: string | null;
  onWorkerIdChange: (value: string) => void;
  onWeekEndingChange: (value: string) => void;
  onAdvanceChange: (value: string) => void;
  onLineChange: (lineId: number, field: keyof FormLine, value: string) => void;
  onAddLine: () => void;
  onRemoveLine: (lineId: number) => void;
  onCreate: () => void;
};

export function TimesheetForm({
  workerId,
  weekEnding,
  advanceRepaymentRequestedPence,
  lines,
  isCreating,
  error,
  onWorkerIdChange,
  onWeekEndingChange,
  onAdvanceChange,
  onLineChange,
  onAddLine,
  onRemoveLine,
  onCreate,
}: TimesheetFormProps) {
  return (
    <section className="panel form-panel">
      <h2>Create a timesheet</h2>

      <div className="form-grid">
        <label>
          Worker ID
          <input
            value={workerId}
            onChange={(event) => onWorkerIdChange(event.target.value)}
            placeholder="Use the worker ID from your seeded database"
          />
        </label>

        <label>
          Week ending
          <input
            type="date"
            value={weekEnding}
            onChange={(event) => onWeekEndingChange(event.target.value)}
          />
        </label>

        <label>
          Advance repayment requested (pence)
          <input
            type="number"
            min="0"
            value={advanceRepaymentRequestedPence}
            onChange={(event) => onAdvanceChange(event.target.value)}
          />
        </label>
      </div>

      <div className="toolbar">
        <h3>Timesheet lines</h3>
        <button type="button" className="secondary-button" onClick={onAddLine}>
          Add row
        </button>
      </div>

      <div className="line-list">
        {lines.map((line) => (
          <div key={line.id} className="line-row">
            <label>
              Date
              <input
                type="date"
                value={line.date}
                onChange={(event) => onLineChange(line.id, "date", event.target.value)}
              />
            </label>

            <label>
              Kind
              <select
                value={line.kind}
                onChange={(event) => onLineChange(line.id, "kind", event.target.value)}
              >
                <option value="LABOUR">LABOUR</option>
                <option value="MATERIALS">MATERIALS</option>
                <option value="EXPENSE">EXPENSE</option>
              </select>
            </label>

            <label>
              Qty
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={line.quantity}
                onChange={(event) => onLineChange(line.id, "quantity", event.target.value)}
              />
            </label>

            <label>
              Unit
              <input
                value={line.unit}
                onChange={(event) => onLineChange(line.id, "unit", event.target.value)}
                placeholder="hour"
              />
            </label>

            <label>
              Rate (pence)
              <input
                type="number"
                min="0"
                step="1"
                value={line.ratePence}
                onChange={(event) => onLineChange(line.id, "ratePence", event.target.value)}
              />
            </label>

            {lines.length > 1 && (
              <button type="button" className="remove-button" onClick={() => onRemoveLine(line.id)}>
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="actions">
        <button type="button" className="primary-button" onClick={onCreate} disabled={isCreating}>
          {isCreating ? "Creating..." : "Create timesheet"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}
    </section>
  );
}
