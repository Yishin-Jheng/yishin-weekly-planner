import type { SprintConfig } from "../types";

const DAY_LABELS = ["週一", "週二", "週三", "週四", "週五"];

// Sprint 1 從 2026/5/25（週一）開始，每週往後推
const SPRINT1_START = new Date(2026, 4, 25);

function fmt(d: Date): string {
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function sprintStart(n: number): Date {
  const d = new Date(SPRINT1_START);
  d.setDate(d.getDate() + (n - 1) * 7);
  return d;
}

export function getSprintDateRange(n: number): string {
  const start = sprintStart(n);
  const end = new Date(start);
  end.setDate(end.getDate() + 4);
  return `${fmt(start)} – ${fmt(end)}`;
}

function isoDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function buildSprintConfig(n: number): SprintConfig {
  const start = sprintStart(n);
  const end = new Date(start);
  end.setDate(end.getDate() + 4);

  const days = DAY_LABELS.map((label, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return { label, date: fmt(d) };
  });

  const daysIso = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return isoDate(d);
  });

  return {
    id: `sprint${n}`,
    cardTitle: `本週每日待辦（${fmt(start)}–${fmt(end)}）`,
    days,
    daysIso,
    month: start.getMonth() + 1,
    year: start.getFullYear(),
    journalTitle: `Sprint ${n} 週記 (${fmt(start)}–${fmt(end)})`,
    journalId: `journal-sprint${n}`,
    reviewTitle: `Sprint ${n} Review（${fmt(end)}）`,
    reviewId: `review-sprint${n}`,
    adjustId: `adjust-sprint${n}`,
    journalPlaceholder: "這週學了什麼？有卡住的地方嗎？",
    extraMetric: false,
  };
}
