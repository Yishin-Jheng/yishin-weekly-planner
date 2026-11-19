import Task from "../Task";
import MiniCalendar from "../MiniCalendar";
import DailyTodoList from "../DailyTodoList";
import type { DailyTodos } from "../../types";

const SPRINT0_DAYS_ISO = [
  "2026-05-18",
  "2026-05-19",
  "2026-05-20",
  "2026-05-21",
  "2026-05-22",
];

interface Props {
  checkboxes: Record<string, boolean>;
  textAreas: Record<string, string>;
  selects: Record<string, number>;
  onCheckbox: (key: string, checked: boolean) => void;
  onTextarea: (key: string, value: string) => void;
  onSelect: (key: string, index: number) => void;
  checkedDates: string[];
  onToggle: (date: string) => void;
  dailyTodos: DailyTodos;
  onAddDailyTodo: (dayKey: string, text: string) => void;
  onToggleDailyTodo: (dayKey: string, id: string, checked: boolean) => void;
  onDeleteDailyTodo: (dayKey: string, id: string) => void;
}

export default function Sprint0Panel({
  checkboxes,
  textAreas,
  selects,
  onCheckbox,
  onTextarea,
  onSelect,
  checkedDates,
  onToggle,
  dailyTodos,
  onAddDailyTodo,
  onToggleDailyTodo,
  onDeleteDailyTodo,
}: Props) {
  const cb = (key: string) => checkboxes[key] ?? false;
  const ta = (key: string) => textAreas[key] ?? "";
  const sel = (key: string) => selects[key] ?? 0;

  return (
    <>
      {/* ── 左欄：每日任務 + 週記 ── */}
      <div className="flex flex-col gap-3">
        <div className="rounded-lg border border-border bg-surface px-5 py-4">
          <div className="mb-3.5 text-[16px] font-semibold tracking-[0.6px] text-text-muted uppercase">
            本週每日待辦（5/18-5/22）
          </div>

          {/* 週一 5/18 */}
          <div className="grid grid-cols-[56px_1fr] gap-3 border-t border-border py-2.5 first:border-t-0">
            <div className="pt-0.5 leading-[1.4] font-semibold text-text-muted">
              週一
              <div className="font-normal text-text-hint">5/18</div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Task
                stateKey="s0_mon_0"
                checked={cb("s0_mon_0")}
                onChange={onCheckbox}
              >
                <span className="mt-0.5 mr-1.25 shrink-0 rounded-sm bg-accent-bg px-1.75 py-0.5 text-[13px] font-medium text-accent">
                  上午
                </span>
                整理開發環境、登入學習平台
              </Task>
              <Task
                stateKey="s0_mon_1"
                checked={cb("s0_mon_1")}
                onChange={onCheckbox}
              >
                <span className="mt-0.5 mr-1.25 shrink-0 rounded-sm bg-accent-bg px-1.75 py-0.5 text-[13px] font-medium text-accent">
                  上午
                </span>
                補上放空週未完成的任務與週回顧
              </Task>
              <Task
                stateKey="s0_mon_2"
                checked={cb("s0_mon_2")}
                onChange={onCheckbox}
              >
                下午看牙醫 🩺
              </Task>
            </div>
          </div>

          {/* 週二 5/19 */}
          <div className="grid grid-cols-[56px_1fr] gap-3 border-t border-border py-2.5 first:border-t-0">
            <div className="pt-0.5 leading-[1.4] font-semibold text-text-muted">
              週二
              <div className="font-normal text-text-hint">5/19</div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Task
                stateKey="s0_tue_0"
                checked={cb("s0_tue_0")}
                onChange={onCheckbox}
              >
                <span className="mt-0.5 mr-1.25 shrink-0 rounded-sm bg-accent-bg px-1.75 py-0.5 text-[13px] font-medium text-accent">
                  上午
                </span>
                透過課程影片先理解「為什麼要有 TypeScript」
              </Task>
              <Task
                stateKey="s0_tue_1"
                checked={cb("s0_tue_1")}
                onChange={onCheckbox}
              >
                <span className="mt-0.5 mr-1.25 shrink-0 rounded-sm bg-accent-bg px-1.75 py-0.5 text-[13px] font-medium text-accent">
                  上午
                </span>
                打開舊作品，記下「看不懂處 / 改進點 / 優點」三件事
              </Task>
              <Task
                stateKey="s0_tue_2"
                checked={cb("s0_tue_2")}
                onChange={onCheckbox}
              >
                <span className="mt-0.5 mr-1.25 shrink-0 rounded-sm bg-success-bg px-1.75 py-0.5 text-[13px] font-medium text-success">
                  下午
                </span>
                Frontend Mentor Newbie 實做一個找回手感的題目
              </Task>
            </div>
          </div>

          {/* 週三 5/20 */}
          <div className="grid grid-cols-[56px_1fr] gap-3 border-t border-border py-2.5 first:border-t-0">
            <div className="pt-0.5 leading-[1.4] font-semibold text-text-muted">
              週三
              <div className="font-normal text-text-hint">5/20</div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Task
                stateKey="s0_wed_0"
                checked={cb("s0_wed_0")}
                disabled={true}
                onChange={onCheckbox}
              >
                <span className="mt-0.5 mr-1.25 shrink-0 rounded-sm bg-accent-bg px-1.75 py-0.5 text-[13px] font-medium text-accent">
                  上午
                </span>
                先規劃今天預計要看的課程再開始上課
              </Task>
              <Task
                stateKey="s0_wed_1"
                checked={cb("s0_wed_1")}
                disabled={true}
                onChange={onCheckbox}
              >
                <span className="mt-0.5 mr-1.25 shrink-0 rounded-sm bg-success-bg px-1.75 py-0.5 text-[13px] font-medium text-success">
                  下午
                </span>{" "}
                把週二完成的 FM
                題目最簡單部分改成 TS（哪怕只改一行）
              </Task>
            </div>
          </div>

          {/* 週四 5/21 */}
          <div className="grid grid-cols-[56px_1fr] gap-3 border-t border-border py-2.5 first:border-t-0">
            <div className="pt-0.5 leading-[1.4] font-semibold text-text-muted">
              週四
              <div className="font-normal text-text-hint">5/21</div>
            </div>
            <div className="flex flex-col gap-1.5">
              <DailyTodoList
                entries={dailyTodos["s0_thu"] ?? []}
                onAdd={(text) => onAddDailyTodo("s0_thu", text)}
                onToggle={(id, checked) =>
                  onToggleDailyTodo("s0_thu", id, checked)
                }
                onDelete={(id) => onDeleteDailyTodo("s0_thu", id)}
              />
            </div>
          </div>

          {/* 週五 5/22 */}
          <div className="grid grid-cols-[56px_1fr] gap-3 border-t border-border py-2.5 first:border-t-0">
            <div className="pt-0.5 leading-[1.4] font-semibold text-text-muted">
              週五
              <div className="font-normal text-text-hint">5/22</div>
            </div>
            <div className="flex flex-col gap-1.5">
              <DailyTodoList
                entries={dailyTodos["s0_fri"] ?? []}
                onAdd={(text) => onAddDailyTodo("s0_fri", text)}
                onToggle={(id, checked) =>
                  onToggleDailyTodo("s0_fri", id, checked)
                }
                onDelete={(id) => onDeleteDailyTodo("s0_fri", id)}
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface px-5 py-4">
          <div className="mb-3.5 text-[16px] font-semibold tracking-[0.6px] text-text-muted uppercase">
            Sprint 0 週記
          </div>
          <textarea
            className="w-full resize-y rounded-md border border-border bg-surface-2 px-3 py-2.5 leading-[1.7] text-text-base font-[inherit] field-sizing-content outline-none transition-[border-color] duration-150 ease-[ease] placeholder:text-text-hint focus:border-accent-mid"
            placeholder="這週的節奏感如何？TypeScript 有沒有變得不那麼陌生？"
            value={ta("journal-sprint0")}
            onChange={(e) => onTextarea("journal-sprint0", e.target.value)}
          />
        </div>
      </div>

      {/* ── 右欄：學習打卡 + Sprint Review ── */}
      <div className="flex flex-col gap-3">
        <div className="rounded-lg border border-border bg-surface px-5 py-4">
          <div className="mb-3.5 text-[16px] font-semibold tracking-[0.6px] text-text-muted uppercase">
            學習打卡
          </div>
          <MiniCalendar
            year={2026}
            month={5}
            sprintDates={SPRINT0_DAYS_ISO}
            checkedDates={checkedDates}
            onToggle={onToggle}
          />
        </div>

        <div className="rounded-lg border border-border bg-surface px-5 py-4">
          <div className="mb-3.5 text-[16px] font-semibold tracking-[0.6px] text-text-muted uppercase">
            Sprint Review（5/22）
          </div>
          <div className="flex items-center justify-between border-t border-border py-2 first-of-type:border-t-0">
            <label className="text-text-muted">對 TypeScript 的陌生感</label>
            <select
              className="w-25 cursor-pointer rounded-[6px] border border-border bg-surface px-2 py-0.75 text-text-base"
              value={sel("s0_ts_feel")}
              onChange={(e) => onSelect("s0_ts_feel", Number(e.target.value))}
            >
              <option value={0}>— 評分 —</option>
              <option value={1}>✅ 明顯降低</option>
              <option value={2}>🔄 略有降低</option>
              <option value={3}>⚠️ 差不多</option>
            </select>
          </div>
          <div className="flex items-center justify-between border-t border-border py-2 first-of-type:border-t-0">
            <label className="text-text-muted">本週印象深刻的事</label>
          </div>
          <textarea
            className="min-h-15 w-full resize-y rounded-md border border-border bg-surface-2 px-3 py-2.5 leading-[1.7] text-text-base font-[inherit] field-sizing-content outline-none transition-[border-color] duration-150 ease-[ease] placeholder:text-text-hint focus:border-accent-mid"
            placeholder="環境配置完畢、克服對 TypeScript 的恐懼等等"
            value={ta("review-sprint0")}
            onChange={(e) => onTextarea("review-sprint0", e.target.value)}
          />
        </div>
      </div>
    </>
  );
}
