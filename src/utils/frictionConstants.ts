import type { FrictionEntry } from "../types";

export const TIME_SLOTS = [
  { value: "morning", label: "上午" },
  { value: "after-lunch", label: "午休" },
  { value: "afternoon", label: "下午" },
] as const;

export const FRICTION_TAGS = [
  { id: "env", label: "環境干擾" },
  { id: "hard", label: "題目太難卡住" },
  { id: "body", label: "身體狀態差" },
  { id: "emotion", label: "情緒低落" },
  { id: "start", label: "不知道從哪裡開始" },
  { id: "distracted", label: "做著做著就去滑手機" },
  { id: "other", label: "其他" },
] as const;

export function getTagLabel(id: string): string {
  return FRICTION_TAGS.find((t) => t.id === id)?.label ?? id;
}

export function getTimeSlotLabel(value: string): string {
  return TIME_SLOTS.find((s) => s.value === value)?.label ?? value;
}

export function getTopFrictionTags(
  entries: FrictionEntry[],
  limit = 3,
): { label: string; count: number }[] {
  const counts: Record<string, number> = {};
  for (const entry of entries) {
    for (const tag of entry.tags) {
      counts[tag] = (counts[tag] ?? 0) + 1;
    }
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id, count]) => ({ label: getTagLabel(id), count }));
}
