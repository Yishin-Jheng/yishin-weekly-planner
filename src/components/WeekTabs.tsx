import { useState } from 'react'
import type { WeekId } from '../types'

interface TabInfo {
  id: string
  label: string
  dateRange: string
}

interface Props {
  tabs: TabInfo[]
  activeWeek: WeekId
  onSwitch: (id: WeekId) => void
  onAddSprint: () => void
  nextSprintNumber: number
  deletableTabIds: Set<string>
  onDeleteTab: (id: string) => void
}

export default function WeekTabs({
  tabs,
  activeWeek,
  onSwitch,
  onAddSprint,
  nextSprintNumber,
  deletableTabIds,
  onDeleteTab,
}: Props) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setConfirmDelete(id)
  }

  const handleConfirm = (id: string) => {
    onDeleteTab(id)
    setConfirmDelete(null)
  }

  return (
    <div className="week-tabs">
      {tabs.map(tab => {
        const isDeletable = deletableTabIds.has(tab.id)

        // 確認刪除狀態
        if (confirmDelete === tab.id) {
          return (
            <div key={tab.id} className="week-tab-confirm">
              <span className="week-tab-confirm-text">刪除 {tab.label}？</span>
              <div className="week-tab-confirm-actions">
                <button
                  className="week-tab-confirm-btn-ok"
                  onClick={() => handleConfirm(tab.id)}
                >
                  刪除
                </button>
                <button
                  className="week-tab-confirm-btn-cancel"
                  onClick={() => setConfirmDelete(null)}
                >
                  取消
                </button>
              </div>
            </div>
          )
        }

        // 一般 tab
        return (
          <button
            key={tab.id}
            className={`week-tab${activeWeek === tab.id ? ' active' : ''}`}
            onClick={() => onSwitch(tab.id)}
          >
            <span className="week-tab-label-row">
              {tab.label}
              {isDeletable && (
                <span
                  className="week-tab-close"
                  role="button"
                  aria-label={`刪除 ${tab.label}`}
                  onClick={e => handleDeleteClick(e, tab.id)}
                >
                  ×
                </span>
              )}
            </span>
            <span className="tab-label">{tab.dateRange}</span>
          </button>
        )
      })}

      <button className="week-tab-add" onClick={onAddSprint} title="新增下一個 Sprint">
        <span className="week-tab-add-icon">＋</span>
        <span>Sprint {nextSprintNumber}</span>
      </button>
    </div>
  )
}
