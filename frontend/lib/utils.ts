import { FormLine } from "./types";

export function makeLine(): FormLine {
  return {
    id: Date.now() + Math.random(),
    date: "2026-08-03",
    kind: "LABOUR",
    quantity: "8",
    unit: "hour",
    ratePence: "1500",
  };
}

export function formatMoney(pence: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
  }).format(pence / 100);
}
