import type { FrictionEntry } from '../types'
import { getTopFrictionTags } from '../utils/frictionConstants'

interface Props {
  entries: FrictionEntry[]
}

export default function FrictionPatternSummary({ entries }: Props) {
  if (entries.length === 0) return null

  const topTags = getTopFrictionTags(entries)
  if (topTags.length === 0) return null

  return (
    <div className="friction-pattern">
      <div className="friction-pattern-title">本 Sprint 摩擦模式</div>
      {topTags.map(({ label, count }) => (
        <div key={label} className="friction-pattern-item">
          <span className="friction-pattern-label">{label}</span>
          <div className="friction-pattern-bar-wrap">
            <div
              className="friction-pattern-bar"
              style={{ width: `${Math.min(100, count * 20)}%` }}
            />
          </div>
          <span className="friction-pattern-count">{count}</span>
        </div>
      ))}
    </div>
  )
}
