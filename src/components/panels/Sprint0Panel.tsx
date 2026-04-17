import Task from "../Task";
import MiniCalendar from "../MiniCalendar";

// Sprint 0：2026/5/18–5/22
const SPRINT0_DAYS_ISO = [
  "2026-05-18",
  "2026-05-19",
  "2026-05-20",
  "2026-05-21",
  "2026-05-22",
];

interface Props {
  checkboxes: Record<string, boolean>;
  textareas: Record<string, string>;
  selects: Record<string, number>;
  onCheckbox: (key: string, checked: boolean) => void;
  onTextarea: (key: string, value: string) => void;
  onSelect: (key: string, index: number) => void;
  checkedDates: string[];
  onToggle: (date: string) => void;
}

export default function Sprint0Panel({
  checkboxes,
  textareas,
  selects,
  onCheckbox,
  onTextarea,
  onSelect,
  checkedDates,
  onToggle,
}: Props) {
  const cb = (key: string) => checkboxes[key] ?? false;
  const ta = (key: string) => textareas[key] ?? "";
  const sel = (key: string) => selects[key] ?? 0;

  return (
    <>
      {/* ── 左欄：每日任務 ── */}
      <div className="schedule-col">
        <div className="card">
          <div className="card-title">
            Sprint 0 暖機週 — 每天 4 小時（10–12 / 14–16）
          </div>

          {/* 週一 5/18 */}
          <div className="day-row">
            <div className="day-label">
              週一
              <div className="day-date">5/18</div>
            </div>
            <div className="day-tasks">
              <Task
                stateKey="s0_mon_0"
                checked={cb("s0_mon_0")}
                onChange={onCheckbox}
              >
                <span className="task-block tag-am">上午</span>{" "}
                整理開發環境、更新 VS Code、登入學習平台
              </Task>
              <Task
                stateKey="s0_mon_1"
                checked={cb("s0_mon_1")}
                onChange={onCheckbox}
              >
                <span className="task-block tag-am">上午</span>{" "}
                打開舊作品，記下「看不懂處 / 改進點 / 優點」三件事
              </Task>
              <Task
                stateKey="s0_mon_2"
                checked={cb("s0_mon_2")}
                onChange={onCheckbox}
              >
                <span className="task-block tag-pm">下午</span>{" "}
                <span className="task-block tag-fm">FM</span> Frontend Mentor
                Newbie 靜態卡片（純 HTML + CSS）
              </Task>
            </div>
          </div>

          {/* 週二 5/19 */}
          <div className="day-row">
            <div className="day-label">
              週二
              <div className="day-date">5/19</div>
            </div>
            <div className="day-tasks">
              <Task
                stateKey="s0_tue_0"
                checked={cb("s0_tue_0")}
                onChange={onCheckbox}
              >
                <span className="task-block tag-am">上午</span>{" "}
                <span className="task-block tag-ts">TS</span> 1.5x
                倍速看「為什麼要有 TypeScript」，只看不寫
              </Task>
              <Task
                stateKey="s0_tue_1"
                checked={cb("s0_tue_1")}
                onChange={onCheckbox}
              >
                <span className="task-block tag-pm">下午</span> 把週一 FM
                卡片最簡單部分改成 TS 寫法（哪怕只改一行）
              </Task>
            </div>
          </div>

          {/* 週三 5/20 */}
          <div className="day-row">
            <div className="day-label">
              週三
              <div className="day-date">5/20</div>
            </div>
            <div className="day-tasks">
              <Task
                stateKey="s0_wed_0"
                checked={cb("s0_wed_0")}
                onChange={onCheckbox}
              >
                <span className="task-block tag-am">上午</span>{" "}
                <span className="task-block tag-react">React</span> 跟著 Jonas
                動手寫範例，逐行確認理解
              </Task>
              <Task
                stateKey="s0_wed_1"
                checked={cb("s0_wed_1")}
                onChange={onCheckbox}
              >
                <span className="task-block tag-pm">下午</span>{" "}
                <span className="task-block tag-fm">FM</span> 第二個 Newbie
                題目，從一開始就用 TS 建檔
              </Task>
            </div>
          </div>

          {/* 週四 5/21 */}
          <div className="day-row">
            <div className="day-label">
              週四
              <div className="day-date">5/21</div>
            </div>
            <div className="day-tasks">
              <Task
                stateKey="s0_thu_0"
                checked={cb("s0_thu_0")}
                onChange={onCheckbox}
              >
                <span className="task-block tag-am">上午</span>{" "}
                針對週一「改進點」，在草稿檔案寫一小段 Refactor
              </Task>
              <Task
                stateKey="s0_thu_1"
                checked={cb("s0_thu_1")}
                onChange={onCheckbox}
              >
                <span className="task-block tag-pm">下午</span>{" "}
                按能量狀態自由選：繼續課程 or 再做一個小題目
              </Task>
            </div>
          </div>

          {/* 週五 5/22 */}
          <div className="day-row">
            <div className="day-label">
              週五
              <div className="day-date">5/22</div>
            </div>
            <div className="day-tasks">
              <Task
                stateKey="s0_fri_0"
                checked={cb("s0_fri_0")}
                onChange={onCheckbox}
              >
                <span className="task-block tag-am">上午</span> 回顧：對 TS
                的陌生感是否比週一低了一點點？
              </Task>
              <Task
                stateKey="s0_fri_1"
                checked={cb("s0_fri_1")}
                onChange={onCheckbox}
              >
                <span className="task-block tag-pm">下午</span>{" "}
                確認下週一課程章節，寫下來貼桌邊
              </Task>
              <Task
                stateKey="s0_fri_2"
                checked={cb("s0_fri_2")}
                onChange={onCheckbox}
              >
                15:30 提早收工 🎉
              </Task>
            </div>
          </div>
        </div>
      </div>

      {/* ── 右欄：週記 + Sprint Review ── */}
      <div className="sidebar-col">
        <div className="card">
          <div className="card-title">學習打卡</div>
          <MiniCalendar
            year={2026}
            month={5}
            sprintDates={SPRINT0_DAYS_ISO}
            checkedDates={checkedDates}
            onToggle={onToggle}
          />
        </div>

        <div className="card">
          <div className="card-title">Sprint 0 週記</div>
          <textarea
            className="journal-area"
            placeholder="這週的節奏感如何？TS 有沒有變得不那麼陌生？"
            value={ta("journal-sprint0")}
            onChange={(e) => onTextarea("journal-sprint0", e.target.value)}
          />
        </div>

        <div className="card">
          <div className="card-title">Sprint Review（5/22）</div>
          <div className="sprint-metric">
            <label>TS 陌生感</label>
            <select
              className="sprint-select"
              value={sel("s0_ts_feel")}
              onChange={(e) => onSelect("s0_ts_feel", Number(e.target.value))}
            >
              <option value={0}>— 評分 —</option>
              <option value={1}>✅ 明顯降低</option>
              <option value={2}>🔄 略有降低</option>
              <option value={3}>⚠️ 差不多</option>
            </select>
          </div>
          <div className="sprint-metric">
            <label>下週進入 6 小時模式？</label>
            <select
              className="sprint-select"
              value={sel("s0_ready")}
              onChange={(e) => onSelect("s0_ready", Number(e.target.value))}
            >
              <option value={0}>— 評估 —</option>
              <option value={1}>✅ 可以</option>
              <option value={2}>⚠️ 再觀察一週</option>
            </select>
          </div>
          <div className="sprint-metric">
            <label>本週亮點</label>
          </div>
          <textarea
            className="journal-area"
            style={{ minHeight: 60 }}
            placeholder="環境配置完畢、克服 TS 恐懼等等"
            value={ta("review-sprint0")}
            onChange={(e) => onTextarea("review-sprint0", e.target.value)}
          />
        </div>
      </div>
    </>
  );
}
