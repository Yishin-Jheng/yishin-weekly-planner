import type {
  SprintConfig,
  FrictionEntry,
  SprintMilestone,
  DailyTodos,
} from "../../types";
import MiniCalendar from "../MiniCalendar";
import MinWinBadge from "../MinWinBadge";
import FrictionLog from "../FrictionLog";
import FrictionPatternSummary from "../FrictionPatternSummary";
import WeeklyMilestones from "../WeeklyMilestones";
import DailyTodoList from "../DailyTodoList";

interface Props {
  config: SprintConfig;
  checkboxes: Record<string, boolean>;
  textAreas: Record<string, string>;
  selects: Record<string, number>;
  minWins: Record<string, string>;
  onCheckbox: (key: string, checked: boolean) => void;
  onTextarea: (key: string, value: string) => void;
  onSelect: (key: string, index: number) => void;
  onMinWin: (key: string, value: string) => void;
  checkedDates: string[];
  onToggle: (date: string) => void;
  frictionEntries: FrictionEntry[];
  onAddFriction: (entry: Omit<FrictionEntry, "id">) => void;
  onDeleteFriction: (id: string) => void;
  milestone: SprintMilestone | null;
  onSetMilestone: (text: string) => void;
  onCompleteMilestone: () => void;
  onDeferMilestone: () => void;
  onResetMilestone: () => void;
  dailyTodos: DailyTodos;
  onAddDailyTodo: (dayKey: string, text: string) => void;
  onToggleDailyTodo: (dayKey: string, id: string, checked: boolean) => void;
  onDeleteDailyTodo: (dayKey: string, id: string) => void;
}

export default function SprintPanel({
  config,
  textAreas,
  selects,
  minWins,
  onTextarea,
  onSelect,
  onMinWin,
  checkedDates,
  onToggle,
  frictionEntries,
  onAddFriction,
  onDeleteFriction,
  milestone,
  onSetMilestone,
  onCompleteMilestone,
  onDeferMilestone,
  onResetMilestone,
  dailyTodos,
  onAddDailyTodo,
  onToggleDailyTodo,
  onDeleteDailyTodo,
}: Props) {
  const {
    id,
    cardTitle,
    days,
    journalTitle,
    journalId,
    reviewTitle,
    reviewId,
    adjustId,
    journalPlaceholder,
    extraMetric,
  } = config;

  const ta = (key: string) => textAreas[key] ?? "";
  const sel = (key: string) => selects[key] ?? 0;

  const progressSelectKey = `${id}_progress`;
  const portfolioSelectKey = `${id}_portfolio`;

  return (
    <>
      {/* ── 左欄 ── */}
      <div className="flex flex-col gap-[12px]">
        <WeeklyMilestones
          milestone={milestone}
          onSet={onSetMilestone}
          onComplete={onCompleteMilestone}
          onDefer={onDeferMilestone}
          onReset={onResetMilestone}
        />

        <div className="rounded-lg border border-border bg-surface px-[20px] py-[16px]">
          <div className="mb-[14px] text-[16px] font-semibold tracking-[0.6px] text-text-muted uppercase">
            {cardTitle}
          </div>
          {days.map((day, di) => (
            <div
              key={day.date}
              className="grid grid-cols-[56px_1fr] gap-[12px] border-t border-border py-[10px] first:border-t-0"
            >
              <div className="pt-[2px] leading-[1.4] font-semibold text-text-muted">
                {day.label}
                <div className="font-normal text-text-hint">{day.date}</div>
              </div>
              <div className="flex flex-col gap-[6px]">
                <MinWinBadge
                  value={minWins[`${id}_d${di}_minWin`] ?? ""}
                  onChange={(val) => onMinWin(`${id}_d${di}_minWin`, val)}
                />
                <DailyTodoList
                  entries={dailyTodos[`${id}_d${di}`] ?? []}
                  onAdd={(text) => onAddDailyTodo(`${id}_d${di}`, text)}
                  onToggle={(todoId, checked) =>
                    onToggleDailyTodo(`${id}_d${di}`, todoId, checked)
                  }
                  onDelete={(todoId) =>
                    onDeleteDailyTodo(`${id}_d${di}`, todoId)
                  }
                />
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-border bg-surface px-[20px] py-[16px]">
          <div className="mb-[14px] text-[16px] font-semibold tracking-[0.6px] text-text-muted uppercase">
            {journalTitle}
          </div>
          <textarea
            className="w-full resize-y rounded-md border border-border bg-surface-2 px-[12px] py-[10px] leading-[1.7] text-text-base font-[inherit] field-sizing-content outline-none transition-[border-color] duration-150 ease-[ease] placeholder:text-text-hint focus:border-accent-mid"
            placeholder={journalPlaceholder}
            value={ta(journalId)}
            onChange={(e) => onTextarea(journalId, e.target.value)}
          />
        </div>
      </div>

      {/* ── 右欄 ── */}
      <div className="flex flex-col gap-[12px]">
        <div className="rounded-lg border border-border bg-surface px-[20px] py-[16px]">
          <div className="mb-[14px] text-[16px] font-semibold tracking-[0.6px] text-text-muted uppercase">
            學習打卡
          </div>
          <MiniCalendar
            year={config.year}
            month={config.month}
            sprintDates={config.daysIso}
            checkedDates={checkedDates}
            onToggle={onToggle}
          />
        </div>

        <FrictionLog
          entries={frictionEntries}
          onAdd={onAddFriction}
          onDelete={onDeleteFriction}
        />

        <div className="rounded-lg border border-border bg-surface px-[20px] py-[16px]">
          <div className="mb-[14px] text-[16px] font-semibold tracking-[0.6px] text-text-muted uppercase">
            {reviewTitle}
          </div>
          <FrictionPatternSummary entries={frictionEntries} />

          <div className="flex items-center justify-between border-t border-border py-[8px] first-of-type:border-t-0">
            <label className="text-text-muted">與前一週相比</label>
            <select
              className="w-[100px] cursor-pointer rounded-[6px] border border-border bg-surface px-[8px] py-[3px] text-text-base"
              value={sel(progressSelectKey)}
              onChange={(e) =>
                onSelect(progressSelectKey, Number(e.target.value))
              }
            >
              <option value={0}>— 評估 —</option>
              <option value={1}>📈 明顯進步</option>
              <option value={2}>🔄 穩定推進</option>
              <option value={3}>⚠️ 需要調整</option>
            </select>
          </div>

          {extraMetric && (
            <div className="flex items-center justify-between border-t border-border py-[8px] first-of-type:border-t-0">
              <label className="text-text-muted">作品集翻新進度</label>
              <select
                className="w-[100px] cursor-pointer rounded-[6px] border border-border bg-surface px-[8px] py-[3px] text-text-base"
                value={sel(portfolioSelectKey)}
                onChange={(e) =>
                  onSelect(portfolioSelectKey, Number(e.target.value))
                }
              >
                <option value={0}>— 評估 —</option>
                <option value={1}>✅ 完成</option>
                <option value={2}>🔄 進行中</option>
                <option value={3}>⚠️ 需加速</option>
              </select>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-border py-[8px] first-of-type:border-t-0">
            <label className="text-text-muted">本週亮點</label>
          </div>
          <textarea
            className="min-h-[60px] w-full resize-y rounded-md border border-border bg-surface-2 px-[12px] py-[10px] leading-[1.7] text-text-base font-[inherit] field-sizing-content outline-none transition-[border-color] duration-150 ease-[ease] placeholder:text-text-hint focus:border-accent-mid"
            placeholder="完成了什麼？有什麼值得記錄的？"
            value={ta(reviewId)}
            onChange={(e) => onTextarea(reviewId, e.target.value)}
          />

          {adjustId && (
            <>
              <div className="flex items-center justify-between border-t border-border py-[8px] first-of-type:border-t-0">
                <label className="text-text-muted">下一階段調整</label>
              </div>
              <textarea
                className="min-h-[60px] w-full resize-y rounded-md border border-border bg-surface-2 px-[12px] py-[10px] leading-[1.7] text-text-base font-[inherit] field-sizing-content outline-none transition-[border-color] duration-150 ease-[ease] placeholder:text-text-hint focus:border-accent-mid"
                placeholder="需要調整節奏嗎？有哪些概念需要補強？"
                value={ta(adjustId)}
                onChange={(e) => onTextarea(adjustId, e.target.value)}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
