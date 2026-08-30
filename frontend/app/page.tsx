"use client";

import { useMemo, useState } from "react";
import { TimesheetForm } from "../components/TimesheetForm";
import { TimesheetSummary } from "../components/TimesheetSummary";
import { apiFetch, transitionMap } from "../lib/api";
import { ApiTimesheetResponse, FormLine, TimesheetStatus } from "../lib/types";
import { makeLine } from "../lib/utils";

export default function Home() {
  const [workerId, setWorkerId] = useState("cmtckbsr30000vh6w0pa1rknw");
  const [weekEnding, setWeekEnding] = useState("2026-08-09");
  const [advanceRepaymentRequestedPence, setAdvanceRepaymentRequestedPence] = useState("15000");
  const [lines, setLines] = useState<FormLine[]>([makeLine()]);
  const [currentTimesheetId, setCurrentTimesheetId] = useState<string | null>(null);
  const [data, setData] = useState<ApiTimesheetResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextTransitions = useMemo(() => {
    if (!data) return [];
    return transitionMap[data.timesheet.status] ?? [];
  }, [data]);

  const updateLine = (id: number, field: keyof FormLine, value: string) => {
    setLines((current) => current.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const addLine = () => {
    setLines((current) => [...current, makeLine()]);
  };

  const removeLine = (id: number) => {
    setLines((current) => current.filter((row) => row.id !== id));
  };

  const refreshTimesheet = async (id: string) => {
    const result = await apiFetch<ApiTimesheetResponse>(`/timesheets/${id}`);
    setData(result);
  };

  const handleCreate = async () => {
    try {
      setError(null);
      setIsCreating(true);

      const payload = {
        workerId,
        weekEnding,
        advanceRepaymentRequestedPence: Number(advanceRepaymentRequestedPence ?? 0),
        lines: lines.map((line) => ({
          date: line.date,
          kind: line.kind,
          quantity: Number(line.quantity),
          unit: line.unit,
          ratePence: Number(line.ratePence),
        })),
      };

      const created = await apiFetch<{ id: string }>("/timesheets", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setCurrentTimesheetId(created.id);
      await refreshTimesheet(created.id);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to create this timesheet.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleTransition = async (to: TimesheetStatus) => {
    if (!currentTimesheetId) return;

    try {
      setError(null);
      setIsTransitioning(true);
      await apiFetch(`/timesheets/${currentTimesheetId}/transition`, {
        method: "POST",
        body: JSON.stringify({ to }),
      });
      await refreshTimesheet(currentTimesheetId);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Transition failed.");
    } finally {
      setIsTransitioning(false);
    }
  };

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">PayTrack</p>
          <h1>Weekly pay timesheet dashboard</h1>
        </div>
        <div className="status-pill">{data ? data.timesheet.status : "Ready to create"}</div>
      </section>

      <TimesheetForm
        workerId={workerId}
        weekEnding={weekEnding}
        advanceRepaymentRequestedPence={advanceRepaymentRequestedPence}
        lines={lines}
        isCreating={isCreating}
        error={error}
        onWorkerIdChange={setWorkerId}
        onWeekEndingChange={setWeekEnding}
        onAdvanceChange={setAdvanceRepaymentRequestedPence}
        onLineChange={updateLine}
        onAddLine={addLine}
        onRemoveLine={removeLine}
        onCreate={handleCreate}
      />

      {data && (
        <TimesheetSummary
          data={data}
          nextTransitions={nextTransitions}
          isTransitioning={isTransitioning}
          onTransition={handleTransition}
        />
      )}
    </main>
  );
}
