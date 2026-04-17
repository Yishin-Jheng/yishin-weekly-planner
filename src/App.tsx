import { useState, useCallback, useEffect } from 'react'
import type { WeekId, PlannerState } from './types'
import { buildSprintConfig, getSprintDateRange } from './utils/sprintDates'
import Header from './components/Header'
import WeekTabs from './components/WeekTabs'
import RestWeekPanel from './components/panels/RestWeekPanel'
import Sprint0Panel from './components/panels/Sprint0Panel'
import SprintPanel from './components/panels/SprintPanel'

const STORAGE_KEY = 'wendy_plan_v1'
const CHECKIN_KEY = 'checkin_log'
const DEFAULT_SPRINTS = [1, 2, 3, 4]

// 放空週與 Sprint 0 為固定分頁，不參與動態管理
const FIXED_TABS = [
  { id: 'rest',    label: '放空週',   dateRange: '5/6 – 5/15'  },
  { id: 'sprint0', label: 'Sprint 0', dateRange: '5/18 – 5/22' },
]

function loadState(): PlannerState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)

      // 舊格式 migration（extraSprints + hiddenSprints → sprints）
      if ('extraSprints' in parsed || 'hiddenSprints' in parsed) {
        const extra: number[] = parsed.extraSprints ?? []
        const hidden: string[] = parsed.hiddenSprints ?? []
        const sprints = [...DEFAULT_SPRINTS, ...extra].filter(
          n => !hidden.includes(`sprint${n}`)
        )
        return {
          checkboxes: parsed.checkboxes ?? {},
          textareas:  parsed.textareas  ?? {},
          selects:    parsed.selects    ?? {},
          sprints,
          minWins:    parsed.minWins    ?? {},
        }
      }

      return {
        checkboxes: parsed.checkboxes ?? {},
        textareas:  parsed.textareas  ?? {},
        selects:    parsed.selects    ?? {},
        sprints:    parsed.sprints    ?? DEFAULT_SPRINTS,
        minWins:    parsed.minWins    ?? {},
      }
    }
  } catch {}
  return { checkboxes: {}, textareas: {}, selects: {}, sprints: DEFAULT_SPRINTS, minWins: {} }
}

function loadCheckinLog(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(CHECKIN_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return {}
}

export default function App() {
  const [activeWeek, setActiveWeek] = useState<WeekId>('rest')
  const [state, setState] = useState<PlannerState>(loadState)
  const [checkinLog, setCheckinLog] = useState<Record<string, boolean>>(loadCheckinLog)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {}
  }, [state])

  useEffect(() => {
    try {
      localStorage.setItem(CHECKIN_KEY, JSON.stringify(checkinLog))
    } catch {}
  }, [checkinLog])

  const onToggle = useCallback((date: string) => {
    setCheckinLog(prev => ({ ...prev, [date]: !prev[date] }))
  }, [])

  const setCheckbox = useCallback((key: string, checked: boolean) => {
    setState(prev => ({ ...prev, checkboxes: { ...prev.checkboxes, [key]: checked } }))
  }, [])

  const setTextarea = useCallback((key: string, value: string) => {
    setState(prev => ({ ...prev, textareas: { ...prev.textareas, [key]: value } }))
  }, [])

  const setSelect = useCallback((key: string, index: number) => {
    setState(prev => ({ ...prev, selects: { ...prev.selects, [key]: index } }))
  }, [])

  const setMinWin = useCallback((key: string, value: string) => {
    setState(prev => ({ ...prev, minWins: { ...prev.minWins, [key]: value } }))
  }, [])

  // 下一個待新增的 sprint 編號
  const nextSprintNumber = state.sprints.length > 0 ? Math.max(...state.sprints) + 1 : 1

  const addNextSprint = useCallback(() => {
    const n = state.sprints.length > 0 ? Math.max(...state.sprints) + 1 : 1
    setState(prev => ({ ...prev, sprints: [...prev.sprints, n] }))
    setActiveWeek(`sprint${n}`)
  }, [state.sprints])

  // 所有 tab（固定 + 動態 sprint）
  const allTabs = [
    ...FIXED_TABS,
    ...state.sprints.map(n => ({
      id:        `sprint${n}`,
      label:     `Sprint ${n}`,
      dateRange: getSprintDateRange(n),
    })),
  ]

  // 放空週與 Sprint 0 不可刪除
  const deletableTabIds = new Set(
    allTabs.map(t => t.id).filter(id => id !== 'rest' && id !== 'sprint0')
  )

  const deleteTab = useCallback((id: string) => {
    const n = parseInt(id.replace('sprint', ''))

    setState(prev => {
      // 從 sprints 陣列移除
      const sprints = prev.sprints.filter(num => num !== n)

      // 硬刪除：清除該 sprint 所有相關的 state key
      const sprintPrefix = `sprint${n}_`
      const textareaIds = [`journal-sprint${n}`, `review-sprint${n}`, `adjust-sprint${n}`]

      const checkboxes = Object.fromEntries(
        Object.entries(prev.checkboxes).filter(([k]) => !k.startsWith(sprintPrefix))
      )
      const textareas = Object.fromEntries(
        Object.entries(prev.textareas).filter(([k]) => !textareaIds.includes(k))
      )
      const selects = Object.fromEntries(
        Object.entries(prev.selects).filter(([k]) => !k.startsWith(sprintPrefix))
      )
      const minWins = Object.fromEntries(
        Object.entries(prev.minWins).filter(([k]) => !k.startsWith(sprintPrefix))
      )

      return { ...prev, sprints, checkboxes, textareas, selects, minWins }
    })

    // 若刪的是當前 tab，切到前一個
    if (activeWeek === id) {
      const idx = allTabs.findIndex(t => t.id === id)
      setActiveWeek(allTabs[idx > 0 ? idx - 1 : 0].id)
    }
  }, [activeWeek, allTabs])

  // 所有 sprint configs 統一由 buildSprintConfig 產生
  const allSprintConfigs = state.sprints.map(n => buildSprintConfig(n))
  const activeSprint = allSprintConfigs.find(s => s.id === activeWeek)

  const panelProps = {
    checkboxes: state.checkboxes,
    textareas:  state.textareas,
    selects:    state.selects,
    minWins:    state.minWins,
    onCheckbox: setCheckbox,
    onTextarea: setTextarea,
    onSelect:   setSelect,
    onMinWin:   setMinWin,
  }

  const checkedDates = Object.keys(checkinLog).filter(k => checkinLog[k])
  const checkinProps = { checkedDates, onToggle }

  return (
    <>
      <div className="header">
        <Header />
        <WeekTabs
          tabs={allTabs}
          activeWeek={activeWeek}
          onSwitch={setActiveWeek}
          onAddSprint={addNextSprint}
          nextSprintNumber={nextSprintNumber}
          deletableTabIds={deletableTabIds}
          onDeleteTab={deleteTab}
        />
      </div>
      <div className="main">
        {activeWeek === 'rest'    && <RestWeekPanel  {...panelProps} />}
        {activeWeek === 'sprint0' && <Sprint0Panel   {...panelProps} {...checkinProps} />}
        {activeSprint             && <SprintPanel config={activeSprint} {...panelProps} {...checkinProps} />}
      </div>
    </>
  )
}
