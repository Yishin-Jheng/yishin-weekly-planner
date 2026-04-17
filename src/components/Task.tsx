import type { ReactNode } from 'react'

interface Props {
  stateKey: string
  checked: boolean
  onChange: (key: string, checked: boolean) => void
  children: ReactNode
  style?: React.CSSProperties
}

export default function Task({ stateKey, checked, onChange, children, style }: Props) {
  return (
    <label className={`task${checked ? ' done' : ''}`} style={style}>
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(stateKey, e.target.checked)}
      />
      <span>{children}</span>
    </label>
  )
}
