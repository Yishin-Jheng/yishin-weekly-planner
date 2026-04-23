import type { SprintConfig, FrictionEntry } from "../../types";
import Task from "../Task";
import TimeBlock from "../TimeBlock";
import MiniCalendar from "../MiniCalendar";
import MinWinBadge from "../MinWinBadge";
import FrictionLog from "../FrictionLog";
import FrictionPatternSummary from "../FrictionPatternSummary";

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
}

export default function SprintPanel({
  config,
  checkboxes,
  textAreas,
  selects,
  minWins,
  onCheckbox,
  onTextarea,
  onSelect,
  onMinWin,
  checkedDates,
  onToggle,
  frictionEntries,
  onAddFriction,
  onDeleteFriction,
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

  const cb = (key: string) => checkboxes[key] ?? false;
  const ta = (key: string) => textAreas[key] ?? "";
  const sel = (key: string) => selects[key] ?? 0;

  const progressSelectKey = `${id}_progress`;
  const portfolioSelectKey = `${id}_portfolio`;

  return (
    <>
      {/* ── 左欄 ── */}
      <div className="schedule-col">
        <div className="card">
          <div className="card-title">每日節奏 — 正式開工（10:00–17:00）</div>
          <TimeBlock
            type="deep"
            time="10:00 – 13:00"
            label="🌊 深潛時間"
            desc="專攻 Jonas React 核心章節或 TS 複雜概念。能量最高，只處理最需思考的東西。"
          />
          <TimeBlock
            type="lunch"
            time="13:00 – 14:00"
            label="☕ 午休"
            desc="遠離桌面，徹底放鬆大腦。"
          />
          <TimeBlock
            type="output"
            time="14:00 – 16:30"
            label="💻 產出時間"
            desc="實作 Frontend Mentor 題目，或翻新舊作品（著重 Coding 手感）。"
          />
          <TimeBlock
            type="review"
            time="16:30 – 17:00"
            label="🤖 AI Review"
            desc="把今日程式碼丟給 AI：型別定義優化、Clean Code 建議、組件結構改進。"
          />
        </div>

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
                <Task
                  stateKey={`${id}_d${di}_deep`}
                  checked={cb(`${id}_d${di}_deep`)}
                  onChange={onCheckbox}
                >
                  深潛：
                </Task>
                <Task
                  stateKey={`${id}_d${di}_output`}
                  checked={cb(`${id}_d${di}_output`)}
                  onChange={onCheckbox}
                >
                  產出：
                </Task>
              </div>
            </div>
          ))}
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

        <div className="card">
          <div className="card-title">{journalTitle}</div>
          <textarea
            className="journal-area"
            placeholder={journalPlaceholder}
            value={ta(journalId)}
            onChange={(e) => onTextarea(journalId, e.target.value)}
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
            <label>與前兩週相比</label>
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
