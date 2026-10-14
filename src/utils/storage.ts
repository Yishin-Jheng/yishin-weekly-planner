import type {
  PlannerState,
  CheckinLog,
  FrictionLogs,
  DailyTodos,
  Milestones,
} from "../types";

export const STORAGE_KEY = "wendy_plan_v1";
export const CHECKIN_KEY = "checkin_log";
export const FRICTION_KEY = "wendy_friction_v1";
export const DAILY_TODOS_KEY = "wendy_daily_todos_v1";
export const MILESTONES_KEY = "wendy_milestones_v1";
export const DEFAULT_SPRINTS = [1, 2, 3, 4];

// 讀取指定的 JSON，取資料發生錯誤時回傳 fallback
export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {}
  return fallback;
}

export function saveJSON<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

// 舊版格式：以 extraSprints / hiddenSprints 記錄 sprint 增減
interface LegacyPlannerState extends Partial<PlannerState> {
  extraSprints?: number[];
  hiddenSprints?: string[];
}

export function loadState(): PlannerState {
  const parsed = loadJSON<LegacyPlannerState | null>(STORAGE_KEY, null);

  if (!parsed || typeof parsed !== "object") {
    return {
      checkboxes: {},
      textAreas: {},
      selects: {},
      sprints: DEFAULT_SPRINTS,
      minWins: {},
    };
  }

  let sprints = parsed.sprints ?? DEFAULT_SPRINTS;
  // 兼容舊版資料格式
  if ("extraSprints" in parsed || "hiddenSprints" in parsed) {
    const extra = parsed.extraSprints ?? [];
    const hidden = parsed.hiddenSprints ?? [];
    sprints = [...DEFAULT_SPRINTS, ...extra].filter(
      (n) => !hidden.includes(`sprint${n}`),
    );
  }

  return {
    checkboxes: parsed.checkboxes ?? {},
    textAreas: parsed.textAreas ?? {},
    selects: parsed.selects ?? {},
    sprints,
    minWins: parsed.minWins ?? {},
  };
}

export const loadCheckinLog = () => loadJSON<CheckinLog>(CHECKIN_KEY, {});
export const loadFrictionLogs = () => loadJSON<FrictionLogs>(FRICTION_KEY, {});
export const loadDailyTodos = () => loadJSON<DailyTodos>(DAILY_TODOS_KEY, {});
export const loadMilestones = () => loadJSON<Milestones>(MILESTONES_KEY, {});
