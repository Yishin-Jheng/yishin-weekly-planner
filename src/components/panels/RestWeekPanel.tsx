import Task from "../Task";

interface Props {
  checkboxes: Record<string, boolean>;
  textareas: Record<string, string>;
  onCheckbox: (key: string, checked: boolean) => void;
  onTextarea: (key: string, value: string) => void;
}

export default function RestWeekPanel({
  checkboxes,
  textareas,
  onCheckbox,
  onTextarea,
}: Props) {
  const cb = (key: string) => checkboxes[key] ?? false;

  return (
    <>
      {/* ── 左欄：本週任務 ── */}
      <div className="schedule-col">
        <div className="card">
          <div className="card-title">本週任務</div>
          <div className="callout" style={{ marginBottom: 16 }}>
            <strong>唯一規則：</strong>真正休息。不對自己有任何學習上的要求。
          </div>

          <div className="day-row">
            <div className="day-label">
              整週
              <div className="day-date">5/6–5/14</div>
            </div>
            <div className="day-tasks">
              <Task
                stateKey="rest_free_activity"
                checked={cb("rest_free_activity")}
                onChange={onCheckbox}
              >
                自由活動：睡覺、遊戲、旅遊，不設限
              </Task>
              <Task
                stateKey="rest_clear_mind"
                checked={cb("rest_clear_mind")}
                onChange={onCheckbox}
              >
                讓腦袋徹底清空，不刷技術文章
              </Task>
            </div>
          </div>

          <div className="day-row">
            <div className="day-label">
              週五
              <div className="day-date">5/15</div>
            </div>
            <div className="day-tasks">
              <Task
                stateKey="rest_check_course"
                checked={cb("rest_check_course")}
                onChange={onCheckbox}
              >
                花 15–20 分鐘打開 Jonas React 課程，確認下週一章節
              </Task>
              <Task
                stateKey="rest_write_chapter"
                checked={cb("rest_write_chapter")}
                onChange={onCheckbox}
              >
                把章節名稱寫下來貼在桌邊，降低週一啟動阻力
              </Task>
            </div>
          </div>
        </div>
      </div>

      {/* ── 右欄：週記 + Sprint 0 確認清單 ── */}
      <div className="sidebar-col">
        <div className="card">
          <div className="card-title">週記與心得</div>
          <textarea
            className="journal-area"
            placeholder="這週怎麼過的？有沒有真正放鬆到？"
            value={textareas["journal-rest"] ?? ""}
            onChange={(e) => onTextarea("journal-rest", e.target.value)}
          />
        </div>

        <div className="card">
          <div className="card-title">進入 Sprint 0 前的確認</div>
          <Task
            stateKey="rest_confirm_course"
            checked={cb("rest_confirm_course")}
            onChange={onCheckbox}
            style={{ padding: "6px 0" }}
          >
            確認 Jonas 課程週一章節已記錄
          </Task>
          <Task
            stateKey="rest_update_vscode"
            checked={cb("rest_update_vscode")}
            onChange={onCheckbox}
            style={{ padding: "6px 0" }}
          >
            VS Code 記得更新
          </Task>
          <Task
            stateKey="rest_sleep_restored"
            checked={cb("rest_sleep_restored")}
            onChange={onCheckbox}
            style={{ padding: "6px 0" }}
          >
            睡眠與精神狀態已恢復
          </Task>
        </div>
      </div>
    </>
  );
}
