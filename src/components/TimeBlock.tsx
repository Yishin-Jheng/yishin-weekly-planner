interface Props {
  type: 'deep' | 'lunch' | 'output' | 'review'
  time: string
  label: string
  desc: string
}

export default function TimeBlock({ type, time, label, desc }: Props) {
  return (
    <div className={`time-block ${type}`}>
      <div className="tb-time">{time}</div>
      <div className="tb-label">{label}</div>
      <div className="tb-desc">{desc}</div>
    </div>
  )
}
