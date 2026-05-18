import type { ReactNode } from "react";

interface Props {
  stateKey: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (key: string, checked: boolean) => void;
  children: ReactNode;
  style?: React.CSSProperties;
}

export default function Task({
  stateKey,
  checked,
  disabled,
  onChange,
  children,
  style,
}: Props) {
  return (
    <label className={`task${checked ? " done" : ""}`} style={style}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(stateKey, e.target.checked)}
      />
      <span className={"task-text"} data-disabled={disabled}>
        {children}
      </span>
    </label>
  );
}
