export type WeekId = string;

export interface SprintConfig {
  id: string;
  cardTitle: string;
  days: { label: string; date: string }[];
  daysIso: string[]; // ISO 格式 (2026-05-25)，給 MiniCalendar 用
  month: number; // 1-12
  year: number;
  journalTitle: string;
  journalId: string;
  reviewTitle: string;
  reviewId: string;
  adjustId: string | null;
  journalPlaceholder: string;
  extraMetric?: boolean;
}

export interface FrictionEntry {
  id: string;
  date: string; // YYYY-MM-DD
  timeSlot: string;
  tags: string[];
  note: string;
}

export interface DailyTodoEntry {
  id: string;
  text: string;
  checked: boolean;
}

export interface SprintMilestone {
  text: string;
  completed: boolean;
  deferred?: boolean;
}

export interface PlannerState {
  checkboxes: Record<string, boolean>;
  textAreas: Record<string, string>;
  selects: Record<string, number>;
  sprints: number[]; // 所有使用中的 sprint 編號，預設 [1, 2, 3, 4]
  minWins: Record<string, string>;
}
