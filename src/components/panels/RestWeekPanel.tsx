import { useState } from "react";
import Task from "../Task";

interface Props {
  checkboxes: Record<string, boolean>;
  textAreas: Record<string, string>;
  onCheckbox: (key: string, checked: boolean) => void;
  onTextarea: (key: string, value: string) => void;
}

const baselineQuestions = [
  {
    label: "現在對 React 最不確定的地方是？",
    key: "vacation-week-baseline-react",
    placeholder:
      "例如：component 之間的狀態管理，常常搞不清楚什麼時候該用 props、什麼時候該用 context",
  },
  {
    label: "現在感覺對 TypeScript 有多陌生？",
    key: "vacation-week-baseline-typescript",
    placeholder: "例如：看得懂基本語法，但一遇到泛型就完全不知道在幹嘛",
  },
  {
    label: "這次空白期最害怕發生什麼樣的事？",
    key: "vacation-week-baseline-fear",
    placeholder: "例如：怕自己三個月後發現什麼都沒學進去",
  },
];
const weeklyTodoList = [
  { content: "自由活動、睡覺、遊戲 etc.", stateKey: "rest_free_activity" },
  {
    content: "確認安裝 Linux 雙系統的前置流程",
    stateKey: "rest_prepare_install",
  },
  { content: "安裝 Linux Fedora 雙系統", stateKey: "rest_install_fedora" },
  {
    content: "在 Linux 上確認所需軟體與環境已準備完成",
    stateKey: "rest_linux_ready",
  },
  {
    content: "確認 VScode 設定與擴充套件已確實同步",
    stateKey: "rest_vscode_sync",
  },
];
const lastDayTodoList = [
  {
    content: "花 15–20 分鐘打開 Jonas React 課程，確認下週一章節",
    stateKey: "rest_check_course",
  },
  {
    content: "把章節名稱寫下來貼在桌邊，降低週一啟動阻力",
    stateKey: "rest_write_chapter",
  },
];

export default function RestWeekPanel({
  checkboxes,
  textAreas,
  onCheckbox,
  onTextarea,
}: Props) {
  const getIsChecked = (key: string) => checkboxes[key] ?? false;

  const [accordionOpen, setAccordionOpen] = useState([false, false, false]);

  const toggleAccordion = (index: number) => {
    setAccordionOpen((prev) => prev.map((v, i) => (i === index ? !v : v)));
  };

  return (
    <>
      {/* ── 左欄 ── */}
      <div className="flex flex-col gap-[12px]">
        <div className="rounded-lg border border-border bg-surface px-[20px] py-[16px]">
          <div className="mb-[14px] text-[16px] font-semibold tracking-[0.6px] text-text-muted uppercase">
            本週任務
          </div>
          {/* 整週任務 */}
          <div className="grid grid-cols-[56px_1fr] gap-[12px] border-t border-border py-[10px] first:border-t-0">
            <div className="pt-[2px] leading-[1.4] font-semibold text-text-muted">
              整週
              <div className="font-normal text-text-hint">5/6–5/14</div>
            </div>
            <div className="flex flex-col gap-[6px]">
              {weeklyTodoList.map(({ content, stateKey }) => (
                <Task
                  key={stateKey}
                  stateKey={stateKey}
                  checked={getIsChecked(stateKey)}
                  onChange={onCheckbox}
                >
                  {content}
                </Task>
              ))}
            </div>
          </div>

          {/* 週五任務 */}
          <div className="grid grid-cols-[56px_1fr] gap-[12px] border-t border-border py-[10px] first:border-t-0">
            <div className="pt-[2px] leading-[1.4] font-semibold text-text-muted">
              週五
              <div className="font-normal text-text-hint">5/15</div>
            </div>
            <div className="flex flex-col gap-[6px]">
              {lastDayTodoList.map(({ content, stateKey }) => (
                <Task
                  key={stateKey}
                  stateKey={stateKey}
                  checked={getIsChecked(stateKey)}
                  disabled={true}
                  onChange={onCheckbox}
                >
                  {content}
                </Task>
              ))}
            </div>
          </div>

          {/* 離開這份工作 */}
          <div className="mt-[8px] border-t border-border pt-[16px]">
            <div className="mb-[10px] flex items-center gap-[6px]">
              <div className="text-[16px] font-semibold tracking-[0.6px] text-text-muted uppercase">
                離開這份工作，我想說的話
              </div>
            </div>
            <textarea
              className="w-full resize-y rounded-md border border-border bg-surface-2 px-[12px] py-[10px] leading-[1.7] text-text-base font-[inherit] field-sizing-content outline-none transition-[border-color] duration-150 ease-[ease] placeholder:text-text-hint focus:border-accent-mid"
              placeholder="感謝？遺憾？委屈？解脫？都可以寫。這裡只有你會看到。"
              value={textAreas["vacation-week-farewell"] ?? ""}
              onChange={(e) =>
                onTextarea("vacation-week-farewell", e.target.value)
              }
            />
          </div>
        </div>
      </div>

      {/* ── 右欄 ── */}
      <div className="flex flex-col gap-[12px]">
        <div className="rounded-lg border border-border bg-surface px-[20px] py-[16px]">
          {/* 出發點記錄 */}
          <div className="mb-[8px] flex flex-wrap items-baseline gap-x-[8px] gap-y-[4px]">
            <div className="text-[16px] font-semibold tracking-[0.6px] text-text-muted uppercase">
              出發點記錄
            </div>
          </div>

          <div>
            {baselineQuestions.map((q, i) => {
              const isOpen = accordionOpen[i];
              const hasContent = !!(textAreas[q.key] ?? "").trim();
              return (
                <div
                  key={q.key}
                  className={i === 0 ? "border-t-0" : "border-t border-border"}
                >
                  <button
                    onClick={() => toggleAccordion(i)}
                    className="flex w-full cursor-pointer items-center justify-between gap-[10px] border-0 bg-transparent py-[10px] text-left font-[inherit]"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-[6px]">
                      {hasContent && (
                        <span className="inline-block size-[6px] shrink-0 rounded-full bg-accent" />
                      )}
                      <span className="text-[12px] leading-normal text-text-muted">
                        {q.label}
                      </span>
                    </div>
                    <span
                      className={`inline-block shrink-0 text-[20px] leading-[20px] text-text-hint transition-transform duration-200 ease-[ease] ${isOpen ? "rotate-180" : "rotate-0"}`}
                    >
                      ▾
                    </span>
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows] duration-200 ease-[ease] ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                  >
                    <div
                      className={`overflow-hidden ${isOpen ? "pb-[10px]" : "pb-0"}`}
                    >
                      <textarea
                        className="w-full resize-y rounded-md border border-border bg-surface-2 px-[12px] py-[10px] leading-[1.7] text-text-base font-[inherit] field-sizing-content outline-none transition-[border-color] duration-150 ease-[ease] placeholder:text-text-hint focus:border-accent-mid"
                        placeholder={q.placeholder}
                        value={textAreas[q.key] ?? ""}
                        onChange={(e) => onTextarea(q.key, e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
