import { useState, useRef, useEffect } from "react";
import type { SprintMilestone } from "../types";

interface Props {
  milestone: SprintMilestone | null;
  onSet: (text: string) => void;
  onComplete: () => void;
  onDefer: () => void;
  onReset: () => void;
}

export default function WeeklyMilestones({
  milestone,
  onSet,
  onComplete,
  onDefer,
  onReset,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputText, setInputText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  const handleStartEdit = () => {
    setInputText(milestone?.text ?? "");
    setIsEditing(true);
  };

  const handleSave = () => {
    const trimmed = inputText.trim();
    if (trimmed) onSet(trimmed);
    setIsEditing(false);
  };

  const hasText = !!milestone?.text;
  const isCompleted = milestone?.completed ?? false;
  const isDeferred = milestone?.deferred ?? false;

  let cardClass = "card milestone-card";
  if (isCompleted) cardClass += " completed";
  else if (isDeferred) cardClass += " deferred";

  return (
    <div className={cardClass}>
      <div className="milestone-header">
        <div className="milestone-title-row">
          <span className="card-title" style={{ margin: 0 }}>
            本週里程碑
          </span>
          <div className="milestone-subtitle">
            量力而為，未完成的項目可放心延到下週
          </div>
          <div className="milestone-actions">
            {hasText && (
              <button className="milestone-reset-btn" onClick={onReset}>
                重設
              </button>
            )}
            {hasText && !isCompleted && !isDeferred && (
              <button className="milestone-complete-btn" onClick={onComplete}>
                標記完成
              </button>
            )}
            {hasText && !isCompleted && !isDeferred && (
              <button className="milestone-defer-btn" onClick={onDefer}>
                標記延後
              </button>
            )}
          </div>
        </div>
      </div>

      {isCompleted && (
        <div className="milestone-achieved">✓ 本週目標達成！</div>
      )}
      {isDeferred && (
        <div className="milestone-deferred-label">↷ 已延至下週</div>
      )}

      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          className="milestone-edit-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") setIsEditing(false);
          }}
          onBlur={handleSave}
          placeholder="輸入本週里程碑..."
        />
      ) : hasText ? (
        <div
          className="milestone-text"
          onClick={!isCompleted && !isDeferred ? handleStartEdit : undefined}
          title={!isCompleted && !isDeferred ? "點擊編輯" : undefined}
        >
          {milestone!.text}
        </div>
      ) : (
        <div className="milestone-placeholder" onClick={handleStartEdit}>
          點擊設定本週里程碑...
        </div>
      )}
    </div>
  );
}
