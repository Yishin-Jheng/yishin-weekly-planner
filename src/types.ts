export type WeekId = string

export interface SprintConfig {
  id: string
  cardTitle: string
  days: { label: string; date: string }[]
  daysIso: string[]   // ISO 格式 (2026-05-25)，給 MiniCalendar 用
  month: number       // 1-12
  year: number
  journalTitle: string
  journalId: string
  reviewTitle: string
  reviewId: string
  adjustId: string | null
  journalPlaceholder: string
  extraMetric?: boolean
}

export interface PlannerState {
  checkboxes: Record<string, boolean>
  textareas: Record<string, string>
  selects: Record<string, number>
  sprints: number[]  // 所有使用中的 sprint 編號，預設 [1, 2, 3, 4]
  minWins: Record<string, string>
}
