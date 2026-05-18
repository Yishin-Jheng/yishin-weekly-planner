import { useState, useEffect } from "react";
import Task from "../Task";

interface Props {
  checkboxes: Record<string, boolean>;
  textAreas: Record<string, string>;
  onCheckbox: (key: string, checked: boolean) => void;
  onTextarea: (key: string, value: string) => void;
}

interface LifeItem {
  id: string;
  text: string;
  checked: boolean;
}

const LIFE_LIST_KEY = "vacation-week-life-list";

function loadLifeList(): LifeItem[] {
  try {
    const raw = localStorage.getItem(LIFE_LIST_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
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
  const cb = (key: string) => checkboxes[key] ?? false;

  const [lifeList, setLifeList] = useState<LifeItem[]>(loadLifeList);

  useEffect(() => {
    try {
      localStorage.setItem(LIFE_LIST_KEY, JSON.stringify(lifeList));
    } catch {}
  }, [lifeList]);

  const addLifeItem = () => {
    setLifeList((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        text: "",
        checked: false,
      },
    ]);
  };

  const updateLifeItem = (id: string, text: string) => {
    setLifeList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, text } : item)),
    );
  };

  const toggleLifeItem = (id: string) => {
    setLifeList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      ),
    );
  };

  const deleteLifeItem = (id: string) => {
    setLifeList((prev) => prev.filter((item) => item.id !== id));
  };

  // 手風琴 state：三個問題各自獨立
  const [accordionOpen, setAccordionOpen] = useState([false, false, false]);

  const toggleAccordion = (index: number) => {
    setAccordionOpen((prev) => prev.map((v, i) => (i === index ? !v : v)));
  };

  return (
    <>
      {/* ── 左欄 ── */}
      <div className="schedule-col">
        <div className="card">
          <div className="card-title">本週任務</div>
          {/* 整週任務 */}
          <div className="day-row">
            <div className="day-label">
              整週
              <div className="day-date">5/6–5/14</div>
            </div>
            <div className="day-tasks">
              {weeklyTodoList.map(({ content, stateKey }) => (
                <Task
                  key={stateKey}
                  stateKey={stateKey}
                  checked={cb(stateKey)}
                  onChange={onCheckbox}
                >
                  {content}
                </Task>
              ))}
            </div>
          </div>

          {/* 這週的生活清單 */}
          {/* <div
            style={{
              borderTop: "1px solid var(--border)",
              paddingTop: 12,
              marginTop: 4,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <div className="card-title" style={{ marginBottom: 0 }}>
                這週其他想做的事
              </div>
              <button className="friction-add-btn" onClick={addLifeItem}>
                ＋ 新增
              </button>
            </div>

            {lifeList.length === 0 ? (
              <div
                style={{
                  fontSize: 12,
                  color: "var(--text-hint)",
                  lineHeight: 1.6,
                  padding: "4px 0 8px",
                }}
              >
                這週想去哪裡？想做什麼？隨手記下來。
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  paddingBottom: 4,
                }}
              >
                {lifeList.map((item) => (
                  <div key={item.id} className="life-list-item">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleLifeItem(item.id)}
                      style={{
                        flexShrink: 0,
                        width: 14,
                        height: 14,
                        accentColor: "var(--accent)",
                        cursor: "pointer",
                      }}
                    />
                    <input
                      type="text"
                      className="life-list-text"
                      value={item.text}
                      onChange={(e) => updateLifeItem(item.id, e.target.value)}
                      placeholder="想去的地方、想做的事、想見的人⋯⋯"
                      style={{
                        textDecoration: item.checked ? "line-through" : "none",
                        color: item.checked
                          ? "var(--text-hint)"
                          : "var(--text)",
                      }}
                    />
                    <button
                      className="life-list-delete"
                      onClick={() => deleteLifeItem(item.id)}
                      title="刪除"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div> */}

          {/* 週五任務 */}
          <div className="day-row">
            <div className="day-label">
              週五
              <div className="day-date">5/15</div>
            </div>
            <div className="day-tasks">
              {lastDayTodoList.map(({ content, stateKey }) => (
                <Task
                  key={stateKey}
                  stateKey={stateKey}
                  checked={cb(stateKey)}
                  disabled={true}
                  onChange={onCheckbox}
                >
                  {content}
                </Task>
              ))}
            </div>
          </div>

          {/* 離開這份工作 */}
          <div
            style={{
              borderTop: "1px solid var(--border)",
              marginTop: 8,
              paddingTop: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 10,
              }}
            >
              <div className="card-title" style={{ marginBottom: 0 }}>
                離開這份工作，我想說的話
              </div>
            </div>
            <textarea
              className="journal-area"
              style={{ height: 200, minHeight: 200 }}
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
      <div className="sidebar-col">
        <div className="card">
          {/* 出發點記錄 */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              flexWrap: "wrap",
              gap: "4px 8px",
              marginBottom: 8,
            }}
          >
            <div className="card-title" style={{ marginBottom: 0 }}>
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
                  style={{
                    borderTop: i === 0 ? "none" : "1px solid var(--border)",
                  }}
                >
                  <button
                    onClick={() => toggleAccordion(i)}
                    className="accordion-trigger"
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      {hasContent && (
                        <span
                          style={{
                            display: "inline-block",
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: "var(--accent)",
                            flexShrink: 0,
                          }}
                        />
                      )}
                      <span
                        style={{
                          fontSize: 12,
                          color: "var(--text-muted)",
                          lineHeight: 1.5,
                        }}
                      >
                        {q.label}
                      </span>
                    </div>
                    <span
                      className="accordion-chevron"
                      style={{
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    >
                      ▾
                    </span>
                  </button>
                  <div className={`accordion-body${isOpen ? " open" : ""}`}>
                    <div className="accordion-inner">
                      <textarea
                        className="journal-area"
                        style={{ height: 72, minHeight: 72 }}
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
