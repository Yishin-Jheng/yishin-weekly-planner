interface Props {
  value: string;
  onChange: (val: string) => void;
}

export default function MinWinBadge({ value, onChange }: Props) {
  return (
    <div className="min-win-badge">
      <label className="min-win-label" htmlFor={undefined}>
        今日最小完成
      </label>
      <input
        className="min-win-input"
        type="text"
        placeholder="請輸入今天需要完成的最小目標"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
