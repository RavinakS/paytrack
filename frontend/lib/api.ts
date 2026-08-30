import { ApiTimesheetResponse, ApiWorker, TimesheetStatus } from "./types";

export const transitionMap: Record<TimesheetStatus, TimesheetStatus[]> = {
  DRAFT: ["SUBMITTED"],
  SUBMITTED: ["APPROVED", "REJECTED"],
  APPROVED: ["PAID"],
  REJECTED: ["DRAFT"],
  PAID: [],
};

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`/api${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  const payload = await response
    .json()
    .catch(() => ({ message: response.statusText }));

  if (!response.ok) {
    throw new Error(
      payload?.message ?? payload?.error ?? "The request failed.",
    );
  }

  return payload as T;
}

export async function getWorkers(): Promise<ApiWorker[]> {
  return apiFetch<ApiWorker[]>("/workers");
}

export async function getTimesheet(id: string): Promise<ApiTimesheetResponse> {
  return apiFetch<ApiTimesheetResponse>(`/timesheets/${id}`);
}
