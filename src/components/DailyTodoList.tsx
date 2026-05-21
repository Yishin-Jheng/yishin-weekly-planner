import { useState, useRef, useEffect } from "react";
import type { DailyTodoEntry } from "../types";

interface Props {
  entries: DailyTodoEntry[];
  onAdd: (text: string) => void;
  onToggle: (id: string, checked: boolean) => void;
  onDelete: (id: string) => void;
}

export default function DailyTodoList({ entries, onAdd, onToggle, onDelete }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [inputText, setInputText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdding) inputRef.current?.focus();
  }, [isAdding]);

  const handleAdd = () => {
    const trimmed = inputText.trim();
    if (trimmed) {
      onAdd(trimmed);
      setInputText("");
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setInputText("");
    setIsAdding(false);
  };

  return (
    <div className="daily-todo-wrap">
      <div className="daily-todo-header">
        <span className="daily-todo-title">我今天想要做...</span>
        {!isAdding && (
          <button className="daily-todo-add-btn" onClick={() => setIsAdding(true)}>
            ＋ 新增
          </button>
        )}
      </div>

      {isAdding && (
        <div className="daily-todo-input-row">
          <input
            ref={inputRef}
            type="text"
            className="daily-todo-input"
            placeholder="輸入今日任務..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
              if (e.key === "Escape") handleCancel();
            }}
          />
          <button className="daily-todo-confirm-btn" onClick={handleAdd}>
            確認
          </button>
          <button className="daily-todo-cancel-btn" onClick={handleCancel}>
            取消
          </button>
        </div>
      )}

      {entries.length > 0 && (
        <div className="daily-todo-list">
          {entries.map((entry) => (
            <div key={entry.id} className="daily-todo-item">
              <input
                type="checkbox"
                className="daily-todo-checkbox"
                checked={entry.checked}
                onChange={(e) => onToggle(entry.id, e.target.checked)}
              />
              <span className={`daily-todo-text${entry.checked ? " done" : ""}`}>
                {entry.text}
              </span>
              <button
                className="daily-todo-delete-btn"
                onClick={() => onDelete(entry.id)}
                title="刪除"
                aria-label="刪除此任務"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {entries.length === 0 && !isAdding && (
        <div className="daily-todo-empty">點擊「新增」加入今日任務</div>
      )}
    </div>
  );
}
