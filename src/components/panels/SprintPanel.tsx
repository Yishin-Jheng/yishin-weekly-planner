import type {
  SprintConfig,
  FrictionEntry,
  SprintMilestone,
  DailyTodoEntry,
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
  onResetMilestone: () => void;
  dailyTodos: Record<string, DailyTodoEntry[]>;
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
      <div className="schedule-col">
        <WeeklyMilestones
          milestone={milestone}
          onSet={onSetMilestone}
          onComplete={onCompleteMilestone}
          onReset={onResetMilestone}
        />

        <div className="card">
          <div className="card-title">{cardTitle}</div>
          {days.map((day, di) => (
            <div key={day.date} className="day-row">
              <div className="day-label">
                {day.label}
                <div className="day-date">{day.date}</div>
              </div>
              <div className="day-tasks">
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

        <div className="card">
          <div className="card-title">{journalTitle}</div>
          <textarea
            className="journal-area"
            placeholder={journalPlaceholder}
            value={ta(journalId)}
            onChange={(e) => onTextarea(journalId, e.target.value)}
          />
        </div>
      </div>

      {/* ── 右欄 ── */}
      <div className="sidebar-col">
        <div className="card">
          <div className="card-title">學習打卡</div>
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

        <div className="card">
          <div className="card-title">{reviewTitle}</div>
          <FrictionPatternSummary entries={frictionEntries} />

          <div className="sprint-metric">
            <label>與前一週相比</label>
            <select
              className="sprint-select"
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
            <div className="sprint-metric">
              <label>作品集翻新進度</label>
              <select
                className="sprint-select"
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

          <div className="sprint-metric">
            <label>本週亮點</label>
          </div>
          <textarea
            className="journal-area"
            style={{ minHeight: 60 }}
            placeholder="完成了什麼？有什麼值得記錄的？"
            value={ta(reviewId)}
            onChange={(e) => onTextarea(reviewId, e.target.value)}
          />

          {adjustId && (
            <>
              <div className="sprint-metric">
                <label>下一階段調整</label>
              </div>
              <textarea
                className="journal-area"
                style={{ minHeight: 60 }}
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
