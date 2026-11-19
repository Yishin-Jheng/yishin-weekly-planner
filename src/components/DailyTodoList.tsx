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
    <div className="flex w-full flex-col gap-[6px]">
      <div className="flex h-[27px] items-center gap-[8px]">
        <span className="font-semibold text-text-muted">我今天想要做...</span>
        {!isAdding && (
          <button
            className="shrink-0 cursor-pointer rounded-[20px] border border-accent-mid bg-accent-bg px-[9px] py-[2px] font-[inherit] font-medium whitespace-nowrap text-accent transition-opacity duration-150 ease-[ease] hover:opacity-80"
            onClick={() => setIsAdding(true)}
          >
            ＋ 新增
          </button>
        )}
      </div>

      {isAdding && (
        <div className="flex items-center gap-[6px]">
          <input
            ref={inputRef}
            type="text"
            className="min-w-0 flex-1 rounded-[6px] border border-accent-mid bg-surface px-[8px] py-[4px] font-[inherit] text-text-base outline-none focus:border-accent focus:shadow-[0_0_0_2px_var(--accent-bg)]"
            placeholder="輸入今日任務..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
              if (e.key === "Escape") handleCancel();
            }}
          />
          <button
            className="cursor-pointer rounded-[20px] border-0 bg-accent px-[10px] py-[3px] font-[inherit] font-medium whitespace-nowrap text-white transition-opacity duration-150 ease-[ease] hover:opacity-85"
            onClick={handleAdd}
          >
            確認
          </button>
          <button
            className="cursor-pointer rounded-[20px] border border-border-strong bg-surface-2 px-[10px] py-[3px] font-[inherit] font-medium whitespace-nowrap text-text-muted transition-opacity duration-150 ease-[ease] hover:opacity-80"
            onClick={handleCancel}
          >
            取消
          </button>
        </div>
      )}

      {entries.length > 0 && (
        <div className="flex flex-col gap-[5px]">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="group/daily-todo flex items-start gap-[7px] leading-normal"
            >
              <input
                type="checkbox"
                className="mt-[3px] size-[14px] shrink-0 cursor-pointer accent-accent"
                checked={entry.checked}
                onChange={(e) => onToggle(entry.id, e.target.checked)}
              />
              <span
                className={`flex-1 ${entry.checked ? "text-text-hint line-through" : "text-text-base"}`}
              >
                {entry.text}
              </span>
              <button
                className="mt-px shrink-0 cursor-pointer border-0 bg-transparent px-[3px] py-px leading-none text-text-hint opacity-0 transition-[opacity,color] duration-150 ease-[ease] group-hover/daily-todo:opacity-100 hover:text-[#d94040]"
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
        <div className="text-text-hint">點擊「新增」加入今日任務</div>
      )}
    </div>
  );
}
