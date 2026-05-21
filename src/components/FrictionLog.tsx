import { useState } from "react";
import type { FrictionEntry } from "../types";
import {
  TIME_SLOTS,
  FRICTION_TAGS,
  getTagLabel,
  getTimeSlotLabel,
} from "../utils/frictionConstants";

function todayIso(): string {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}

function formatDate(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${parseInt(m)}/${parseInt(d)}`;
}

interface Props {
  entries: FrictionEntry[];
  onAdd: (entry: Omit<FrictionEntry, "id">) => void;
  onDelete: (id: string) => void;
}

export default function FrictionLog({ entries, onAdd, onDelete }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState(todayIso);
  const [timeSlot, setTimeSlot] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [note, setNote] = useState("");

  const toggleTag = (id: string) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  };

  const handleOpen = () => {
    setDate(todayIso());
    setTimeSlot("");
    setSelectedTags([]);
    setNote("");
    setIsOpen(true);
  };

  const handleSubmit = () => {
    onAdd({ date, timeSlot, tags: selectedTags, note });
    setIsOpen(false);
  };

  return (
    <div className="card">
      <div className="friction-header">
        <div className="card-title" style={{ margin: 0 }}>
          摩擦日誌
        </div>
        {!isOpen && (
          <button className="friction-add-btn" onClick={handleOpen}>
            ＋ 記錄今日摩擦點
          </button>
        )}
      </div>

      {isOpen && (
        <div className="friction-form">
          <div className="friction-form-top-row">
            <input
              type="date"
              className="friction-date-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <select
              className="sprint-select friction-slot-select"
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
            >
              <option value="">— 時段 —</option>
              {TIME_SLOTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="friction-tags">
            {FRICTION_TAGS.map((tag) => (
              <button
                key={tag.id}
                className={`friction-tag${selectedTags.includes(tag.id) ? " active" : ""}`}
                onClick={() => toggleTag(tag.id)}
              >
                {tag.label}
              </button>
            ))}
          </div>

          <textarea
            className="journal-area"
            style={{ minHeight: 56 }}
            placeholder="有什麼想補充的嗎？例如：剛吃完飯特別想睡，下次試試吃少一點"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <div className="friction-form-actions">
            <button className="friction-submit-btn" onClick={handleSubmit}>
              記下來
            </button>
            <button
              className="friction-cancel-btn"
              onClick={() => setIsOpen(false)}
            >
              取消
            </button>
          </div>
        </div>
      )}

      <div className="friction-list">
        {entries.length === 0 && !isOpen ? (
          <div className="friction-empty">
            這週還沒有記錄，狀態很好？還是忘了記？
          </div>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="friction-entry">
              <div className="friction-entry-left">
                <span className="friction-entry-date">
                  {formatDate(entry.date)}
                </span>
                {entry.timeSlot && (
                  <span className="friction-entry-slot">
                    {getTimeSlotLabel(entry.timeSlot)}
                  </span>
                )}
              </div>
              <div className="friction-entry-body">
                {entry.tags.length > 0 && (
                  <div className="friction-entry-tags">
                    {entry.tags.map((t) => (
                      <span key={t} className="friction-tag-display">
                        {getTagLabel(t)}
                      </span>
                    ))}
                  </div>
                )}
                {entry.note && (
                  <div className="friction-entry-note">{entry.note}</div>
                )}
              </div>
              <button
                className="friction-delete-btn"
                onClick={() => onDelete(entry.id)}
                title="刪除"
                aria-label="刪除此記錄"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
