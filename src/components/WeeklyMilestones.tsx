import { useState, useRef, useEffect } from "react";
import type { SprintMilestone } from "../types";

interface Props {
  milestone: SprintMilestone | null;
  onSet: (text: string) => void;
  onComplete: () => void;
  onReset: () => void;
}

export default function WeeklyMilestones({
  milestone,
  onSet,
  onComplete,
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

  return (
    <div className={`card milestone-card${isCompleted ? " completed" : ""}`}>
      <div className="milestone-header">
        <div className="milestone-title-row">
          <span className="card-title" style={{ margin: 0 }}>
            本週里程碑
          </span>
          <div className="milestone-subtitle">
            量力而為，未完成的項目可放心延到下週
          </div>
          <div className="milestone-actions">
            {hasText && !isCompleted && (
              <button className="milestone-complete-btn" onClick={onComplete}>
                標記完成
              </button>
            )}
            {hasText && (
              <button className="milestone-reset-btn" onClick={onReset}>
                重設
              </button>
            )}
          </div>
        </div>
      </div>

      {isCompleted && (
        <div className="milestone-achieved">✓ 本週目標達成！</div>
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
          onClick={!isCompleted ? handleStartEdit : undefined}
          title={!isCompleted ? "點擊編輯" : undefined}
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
